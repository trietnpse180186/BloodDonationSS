package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.request.BloodUsageRequestDTO;
import com.swpproject.BloodDonation.dto.response.BloodInventoryDetailDTO;
import com.swpproject.BloodDonation.dto.response.BloodInventorySummaryDTO;
import com.swpproject.BloodDonation.entity.BloodInventory;
import com.swpproject.BloodDonation.entity.BloodInventoryBatch;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.enums.BloodType;
import com.swpproject.BloodDonation.repository.BloodInventoryBatchRepository;
import com.swpproject.BloodDonation.repository.BloodInventoryRepository;
import com.swpproject.BloodDonation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BloodInventoryService {

    private final BloodInventoryRepository inventoryRepository;
    private final BloodInventoryBatchRepository batchRepository;
    private final UserRepository userRepository;
    private final NotificationEventPublisher notificationPublisher;

    // Thời hạn sử dụng máu (35 ngày)
    private static final int BLOOD_EXPIRY_DAYS = 35;
    // Lượng máu tiêu chuẩn mỗi lần hiến (ml)
    private static final double STANDARD_DONATION_AMOUNT = 350.0;
    // Ngưỡng máu sắp hết (7 ngày)
    private static final int LOW_INVENTORY_THRESHOLD_DAYS = 7;

    /**
     * Thêm máu vào kho sau khi người dùng hiến máu thành công
     */
    @Transactional
    public BloodInventoryDetailDTO addBloodToDonation(String donorId, String donationId, String source, String updatedBy) {
        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người hiến máu"));

        BloodType bloodType = donor.getBloodType();
        if (bloodType == null) {
            throw new RuntimeException("Người hiến không có thông tin nhóm máu");
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiryDate = now.plusDays(BLOOD_EXPIRY_DAYS);

        // Tạo thông tin đơn vị máu mới
        BloodInventory newInventory = BloodInventory.builder()
                .bloodType(bloodType)
                .quantity(STANDARD_DONATION_AMOUNT)
                .receivedDate(now)
                .expiryDate(expiryDate)
                .source(source)
                .donationId(donationId)
                .donorId(donorId)
                .status("AVAILABLE")
                .lastUpdatedBy(updatedBy)
                .lastUpdatedTime(now)
                .build();

        BloodInventory savedInventory = inventoryRepository.save(newInventory);

        // Cập nhật hoặc tạo lô máu
        updateOrCreateBatch(bloodType, STANDARD_DONATION_AMOUNT, source, updatedBy);

        // Kiểm tra và gửi cảnh báo nếu lượng máu thấp
        checkAndNotifyLowInventory();

        return mapToDetailDTO(savedInventory);
    }

    /**
     * Cập nhật hoặc tạo lô máu mới
     */
    private void updateOrCreateBatch(BloodType bloodType, double quantity, String source, String updatedBy) {
        // Tìm lô máu phù hợp để cập nhật
        List<BloodInventoryBatch> activeBatches = batchRepository.findByBloodTypeAndStatus(bloodType, "ACTIVE");

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiryDate = now.plusDays(BLOOD_EXPIRY_DAYS);

        // Nếu có lô máu đang hoạt động và chưa hết hạn, cập nhật lô đó
        boolean updated = false;

        for (BloodInventoryBatch batch : activeBatches) {
            if (batch.getExpiryDate().isAfter(now)) {
                batch.setTotalQuantity(batch.getTotalQuantity() + quantity);
                batch.setRemainingQuantity(batch.getRemainingQuantity() + quantity);
                batch.setLastUpdatedBy(updatedBy);
                batch.setLastUpdatedTime(now);
                batchRepository.save(batch);
                updated = true;
                break;
            }
        }

        // Nếu không có lô phù hợp, tạo lô mới
        if (!updated) {
            BloodInventoryBatch newBatch = BloodInventoryBatch.builder()
                    .bloodType(bloodType)
                    .totalQuantity(quantity)
                    .remainingQuantity(quantity)
                    .receivedDate(now)
                    .expiryDate(expiryDate)
                    .status("ACTIVE")
                    .source(source)
                    .lastUpdatedBy(updatedBy)
                    .lastUpdatedTime(now)
                    .build();

            batchRepository.save(newBatch);
        }
    }

    /**
     * Sử dụng máu từ kho
     */
    @Transactional
    public boolean useBlood(BloodUsageRequestDTO request, String updatedBy) {
        BloodType bloodType = request.getBloodType();
        Double requestedQuantity = request.getQuantity();

        // Kiểm tra xem có đủ lượng máu không
        Double availableQuantity = getAvailableQuantityByBloodType(bloodType);
        if (availableQuantity == null || availableQuantity < requestedQuantity) {
            return false;
        }

        // Lấy danh sách đơn vị máu khả dụng theo thứ tự hết hạn
        List<BloodInventory> availableUnits = inventoryRepository.findAvailableBloodByTypeOrderByExpiryDate(
                bloodType, LocalDateTime.now());

        Double remainingRequest = requestedQuantity;
        LocalDateTime now = LocalDateTime.now();

        for (BloodInventory unit : availableUnits) {
            if (remainingRequest <= 0) break;

            // Nếu đơn vị này đủ để đáp ứng
            if (unit.getQuantity() >= remainingRequest) {
                // Nếu sử dụng hết đơn vị
                if (unit.getQuantity().equals(remainingRequest)) {
                    unit.setStatus("USED");
                    unit.setQuantity(0.0);
                } else {
                    // Nếu chỉ sử dụng một phần
                    unit.setQuantity(unit.getQuantity() - remainingRequest);
                }

                unit.setLastUpdatedBy(updatedBy);
                unit.setLastUpdatedTime(now);
                unit.setNotes((unit.getNotes() != null ? unit.getNotes() : "") + "\nSử dụng " + remainingRequest +
                        "ml cho: " + request.getReason() + " vào " + now);

                remainingRequest = 0.0;
            } else {
                // Nếu đơn vị này không đủ
                remainingRequest -= unit.getQuantity();
                unit.setStatus("USED");
                unit.setNotes((unit.getNotes() != null ? unit.getNotes() : "") + "\nĐã sử dụng hết cho: " +
                        request.getReason() + " vào " + now);
                unit.setQuantity(0.0);
                unit.setLastUpdatedBy(updatedBy);
                unit.setLastUpdatedTime(now);
            }

            inventoryRepository.save(unit);
        }

        // Cập nhật các lô máu
        updateBatchesAfterUsage(bloodType, requestedQuantity, updatedBy);

        // Kiểm tra và gửi cảnh báo nếu lượng máu thấp
        checkAndNotifyLowInventory();

        return remainingRequest <= 0;
    }

    /**
     * Cập nhật lô máu sau khi sử dụng
     */
    private void updateBatchesAfterUsage(BloodType bloodType, Double usedQuantity, String updatedBy) {
        List<BloodInventoryBatch> batches = batchRepository.findByBloodTypeAndStatus(bloodType, "ACTIVE");
        batches.sort(Comparator.comparing(BloodInventoryBatch::getExpiryDate));

        Double remainingToUse = usedQuantity;
        LocalDateTime now = LocalDateTime.now();

        for (BloodInventoryBatch batch : batches) {
            if (remainingToUse <= 0) break;

            if (batch.getRemainingQuantity() >= remainingToUse) {
                batch.setRemainingQuantity(batch.getRemainingQuantity() - remainingToUse);
                remainingToUse = 0.0;
            } else {
                remainingToUse -= batch.getRemainingQuantity();
                batch.setRemainingQuantity(0.0);
            }

            batch.setLastUpdatedBy(updatedBy);
            batch.setLastUpdatedTime(now);

            // Nếu lô đã hết máu, đánh dấu là DEPLETED
            if (batch.getRemainingQuantity() <= 0) {
                batch.setStatus("DEPLETED");
            }

            batchRepository.save(batch);
        }
    }

    /**
     * Lấy tổng số lượng máu khả dụng theo nhóm máu
     */
    public Double getAvailableQuantityByBloodType(BloodType bloodType) {
        return inventoryRepository.getTotalAvailableQuantity(bloodType, LocalDateTime.now());
    }

    /**
     * Kiểm tra và thông báo nếu lượng máu thấp
     */
    private void checkAndNotifyLowInventory() {
        // Kiểm tra từng nhóm máu
        for (BloodType bloodType : BloodType.values()) {
            Double availableQuantity = getAvailableQuantityByBloodType(bloodType);

            // Nếu số lượng máu dưới ngưỡng (dưới 1050ml tương đương 3 đơn vị máu)
            if (availableQuantity != null && availableQuantity < 1050) {
                // Tìm tất cả admin và staff để thông báo
                notifyLowBloodInventory(bloodType, availableQuantity);
            }
        }
    }

    /**
     * Gửi thông báo về lượng máu thấp
     */
    private void notifyLowBloodInventory(BloodType bloodType, Double quantity) {
        String title = "CẢNH BÁO: Lượng máu " + bloodType + " sắp hết!";
        String message = "Hiện kho máu chỉ còn " + String.format("%.0f", quantity) +
                " ml máu " + bloodType + " (khoảng " +
                String.format("%.1f", quantity/STANDARD_DONATION_AMOUNT) +
                " đơn vị). Cần bổ sung gấp!";

        // Cách hiệu quả hơn - lấy trực tiếp từ database
        List<User> staffAndAdmins = userRepository.findAllStaffAndAdmin();

        for (User staff : staffAndAdmins) {
            notificationPublisher.publishNotificationCreatedEvent(
                    staff.getUserID(),
                    title,
                    message,
                    "/blood-inventory",
                    "LOW_BLOOD_INVENTORY",
                    "HIGH"
            );
        }
    }

    /**
     * Lấy tóm tắt tồn kho theo nhóm máu
     */
    public List<BloodInventorySummaryDTO> getInventorySummary() {
        List<BloodInventorySummaryDTO> summary = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiringSoon = now.plusDays(LOW_INVENTORY_THRESHOLD_DAYS);
        LocalDateTime monthStart = now.withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);

        for (BloodType bloodType : BloodType.values()) {
            Double availableQuantity = inventoryRepository.getTotalAvailableQuantity(bloodType, now);
            if (availableQuantity == null) availableQuantity = 0.0;

            // Tìm số đơn vị sắp hết hạn
            List<BloodInventory> expiringUnits = inventoryRepository.findExpiringBlood(now, expiringSoon)
                    .stream()
                    .filter(unit -> unit.getBloodType() == bloodType)
                    .collect(Collectors.toList());

            // Lấy số lượng máu đã sử dụng trong tháng
            Double usedThisMonth = inventoryRepository.getUsedBloodByTypeInPeriod(
                    bloodType, monthStart, now);
            if (usedThisMonth == null) usedThisMonth = 0.0;

            // Lấy số lượng máu đã nhận trong tháng
            Double receivedThisMonth = inventoryRepository.getReceivedBloodByTypeInPeriod(
                    bloodType, monthStart, now);
            if (receivedThisMonth == null) receivedThisMonth = 0.0;

            BloodInventorySummaryDTO bloodSummary = BloodInventorySummaryDTO.builder()
                    .bloodType(bloodType)
                    .totalQuantity(availableQuantity)
                    .availableQuantity(availableQuantity)
                    .availableUnits((int) Math.floor(availableQuantity / STANDARD_DONATION_AMOUNT))
                    .expiringUnits(expiringUnits.size())
                    .usedThisMonth(usedThisMonth)
                    .receivedThisMonth(receivedThisMonth)
                    .build();

            summary.add(bloodSummary);
        }

        return summary;
    }

    /**
     * Lấy chi tiết tồn kho
     */
    public List<BloodInventoryDetailDTO> getInventoryDetails(BloodType bloodType) {
        List<BloodInventory> inventory;

        if (bloodType != null) {
            inventory = inventoryRepository.findByBloodTypeAndStatus(bloodType, "AVAILABLE");
        } else {
            inventory = inventoryRepository.findAvailableBloodOrderByExpiryDate(LocalDateTime.now());
        }

        return inventory.stream()
                .map(this::mapToDetailDTO)
                .collect(Collectors.toList());
    }

    /**
     * Chuyển đổi entity sang DTO
     */
    public BloodInventoryDetailDTO mapToDetailDTO(BloodInventory inventory) {
        // Tính số ngày còn lại đến khi hết hạn
        long daysUntilExpiry = ChronoUnit.DAYS.between(LocalDateTime.now(), inventory.getExpiryDate());

        // Lấy tên người hiến máu nếu có
        String donorName = "";
        if (inventory.getDonorId() != null) {
            donorName = userRepository.findById(inventory.getDonorId())
                    .map(User::getFullName)
                    .orElse("");
        }

        return BloodInventoryDetailDTO.builder()
                .id(inventory.getId())
                .bloodType(inventory.getBloodType())
                .quantity(inventory.getQuantity())
                .receivedDate(inventory.getReceivedDate())
                .expiryDate(inventory.getExpiryDate())
                .source(inventory.getSource())
                .donationId(inventory.getDonationId())
                .donorId(inventory.getDonorId())
                .donorName(donorName)
                .status(inventory.getStatus())
                .notes(inventory.getNotes())
                .daysUntilExpiry((int) daysUntilExpiry)
                .build();
    }

    /**
     * Đánh dấu đơn vị máu đã hết hạn
     */
    @Transactional
    public void markExpiredBlood(String updatedBy) {
        LocalDateTime now = LocalDateTime.now();
        List<BloodInventory> inventory = inventoryRepository.findAll();

        for (BloodInventory unit : inventory) {
            if ("AVAILABLE".equals(unit.getStatus()) && unit.getExpiryDate().isBefore(now)) {
                unit.setStatus("EXPIRED");
                unit.setLastUpdatedBy(updatedBy);
                unit.setLastUpdatedTime(now);
                inventoryRepository.save(unit);
            }
        }

        // Cập nhật các lô máu
        List<BloodInventoryBatch> batches = batchRepository.findAll();
        for (BloodInventoryBatch batch : batches) {
            if ("ACTIVE".equals(batch.getStatus()) && batch.getExpiryDate().isBefore(now)) {
                batch.setStatus("EXPIRED");
                batch.setLastUpdatedBy(updatedBy);
                batch.setLastUpdatedTime(now);
                batchRepository.save(batch);
            }
        }
    }

    /**
     * Cập nhật thông tin đơn vị máu
     */
    @Transactional
    public BloodInventoryDetailDTO updateBloodInventory(String inventoryId,
                                                        Double quantity,
                                                        LocalDateTime expiryDate,
                                                        String status,
                                                        String notes,
                                                        String updatedBy) {
        BloodInventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn vị máu"));

        // Lưu thông tin cũ để cập nhật lô sau đó
        BloodType bloodType = inventory.getBloodType();
        Double oldQuantity = inventory.getQuantity();
        String oldStatus = inventory.getStatus();

        // Cập nhật thông tin mới
        if (quantity != null && quantity >= 0) {
            inventory.setQuantity(quantity);
        }

        if (expiryDate != null) {
            inventory.setExpiryDate(expiryDate);
        }

        if (status != null && !status.isEmpty()) {
            inventory.setStatus(status);
        }

        if (notes != null) {
            inventory.setNotes(notes);
        }

        inventory.setLastUpdatedBy(updatedBy);
        inventory.setLastUpdatedTime(LocalDateTime.now());

        BloodInventory updatedInventory = inventoryRepository.save(inventory);

        // Cập nhật thông tin lô nếu có thay đổi số lượng hoặc trạng thái
        if ((quantity != null && !oldQuantity.equals(quantity)) ||
                (status != null && !oldStatus.equals(status))) {
            updateBatchAfterInventoryChange(bloodType, oldQuantity,
                    inventory.getQuantity(), oldStatus, inventory.getStatus(), updatedBy);
        }

        return mapToDetailDTO(updatedInventory);
    }

    /**
     * Cập nhật lô sau khi thay đổi đơn vị máu
     */
    private void updateBatchAfterInventoryChange(BloodType bloodType,
                                                 Double oldQuantity,
                                                 Double newQuantity,
                                                 String oldStatus,
                                                 String newStatus,
                                                 String updatedBy) {
        // Tìm tất cả lô của nhóm máu này
        List<BloodInventoryBatch> batches = batchRepository.findByBloodTypeAndStatus(bloodType, "ACTIVE");
        if (batches.isEmpty()) return;

        // Lấy lô mới nhất
        BloodInventoryBatch batch = batches.stream()
                .max(Comparator.comparing(BloodInventoryBatch::getReceivedDate))
                .orElse(null);

        if (batch == null) return;

        LocalDateTime now = LocalDateTime.now();

        // Tính toán thay đổi số lượng
        Double quantityDifference = 0.0;

        // Nếu trạng thái trước đó là AVAILABLE và bây giờ không phải
        if ("AVAILABLE".equals(oldStatus) && !"AVAILABLE".equals(newStatus)) {
            quantityDifference = -oldQuantity; // Trừ toàn bộ số lượng cũ
        }
        // Nếu trạng thái trước đó không phải AVAILABLE và bây giờ là AVAILABLE
        else if (!"AVAILABLE".equals(oldStatus) && "AVAILABLE".equals(newStatus)) {
            quantityDifference = newQuantity; // Cộng toàn bộ số lượng mới
        }
        // Nếu vẫn giữ trạng thái AVAILABLE nhưng số lượng thay đổi
        else if ("AVAILABLE".equals(oldStatus) && "AVAILABLE".equals(newStatus)) {
            quantityDifference = newQuantity - oldQuantity;
        }

        // Cập nhật lô
        batch.setTotalQuantity(batch.getTotalQuantity() + quantityDifference);
        batch.setRemainingQuantity(batch.getRemainingQuantity() + quantityDifference);
        batch.setLastUpdatedBy(updatedBy);
        batch.setLastUpdatedTime(now);

        // Nếu lô hết máu, đánh dấu là DEPLETED
        if (batch.getRemainingQuantity() <= 0) {
            batch.setStatus("DEPLETED");
        }

        batchRepository.save(batch);
    }

    /**
     * Xóa đơn vị máu
     */
    @Transactional
    public void deleteBloodInventory(String inventoryId, String deletedBy) {
        BloodInventory inventory = inventoryRepository.findById(inventoryId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn vị máu"));

        // Nếu đơn vị máu còn khả dụng, cập nhật lô trước khi xóa
        if ("AVAILABLE".equals(inventory.getStatus())) {
            BloodType bloodType = inventory.getBloodType();
            Double quantity = inventory.getQuantity();

            // Cập nhật lô
            updateBatchAfterInventoryChange(bloodType, quantity, 0.0, "AVAILABLE", "DELETED", deletedBy);
        }

        // Ghi log trước khi xóa
        log.info("Xóa đơn vị máu ID {} (loại: {}, số lượng: {}) bởi {}",
                inventoryId, inventory.getBloodType(), inventory.getQuantity(), deletedBy);

        // Xóa đơn vị máu
        inventoryRepository.delete(inventory);
    }

    /**
     * Cập nhật thông tin lô máu
     */
    @Transactional
    public void updateBloodBatch(String batchId,
                                 Double totalQuantity,
                                 Double remainingQuantity,
                                 LocalDateTime expiryDate,
                                 String status,
                                 String notes,
                                 String updatedBy) {
        BloodInventoryBatch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lô máu"));

        // Cập nhật thông tin
        if (totalQuantity != null && totalQuantity >= 0) {
            batch.setTotalQuantity(totalQuantity);
        }

        if (remainingQuantity != null && remainingQuantity >= 0) {
            batch.setRemainingQuantity(remainingQuantity);
        }

        if (expiryDate != null) {
            batch.setExpiryDate(expiryDate);
        }

        if (status != null && !status.isEmpty()) {
            batch.setStatus(status);
        }

        if (notes != null) {
            batch.setNotes(notes);
        }

        batch.setLastUpdatedBy(updatedBy);
        batch.setLastUpdatedTime(LocalDateTime.now());

        batchRepository.save(batch);
    }

    /**
     * Xóa lô máu
     */
    @Transactional
    public void deleteBloodBatch(String batchId, String deletedBy) {
        BloodInventoryBatch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lô máu"));

        // Ghi log trước khi xóa
        log.info("Xóa lô máu ID {} (loại: {}, số lượng: {}) bởi {}",
                batchId, batch.getBloodType(), batch.getTotalQuantity(), deletedBy);

        batchRepository.delete(batch);
    }
}