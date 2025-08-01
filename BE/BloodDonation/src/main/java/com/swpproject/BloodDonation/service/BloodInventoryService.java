package com.swpproject.BloodDonation.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

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
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.BeanUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.List;
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
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        BloodType bloodType = donor.getBloodType();
        if (bloodType == null) {
            throw new RuntimeException("Donor does not have blood type information");
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

        // Định dạng ngày giờ đẹp hơn
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        String formattedDateTime = now.format(formatter);

        for (BloodInventory unit : availableUnits) {
            if (remainingRequest <= 0) break;

            // Nếu đơn vị này đủ để đáp ứng
            if (unit.getQuantity() >= remainingRequest) {
                // Nếu sử dụng hết đơn vị
                if (unit.getQuantity().equals(remainingRequest)) {
                    unit.setStatus("USED");
                    unit.setUsedQuantity(remainingRequest);
                    unit.setQuantity(0.0);
                } else {
                    // Nếu chỉ sử dụng một phần
                    unit.setUsedQuantity(remainingRequest);
                    unit.setQuantity(unit.getQuantity() - remainingRequest);

                    // Tạo bản ghi mới cho phần đã sử dụng
                    BloodInventory usedPortion = new BloodInventory();
                    BeanUtils.copyProperties(unit, usedPortion);
                    usedPortion.setId(null);
                    usedPortion.setQuantity(0.0);
                    usedPortion.setUsedQuantity(remainingRequest);
                    usedPortion.setStatus("USED");
                    usedPortion.setLastUpdatedTime(now);
                    usedPortion.setLastUpdatedBy(updatedBy);
                    usedPortion.setNotes("Used " + remainingRequest + "ml for: " + request.getReason() + " on " + formattedDateTime);
                    inventoryRepository.save(usedPortion);
                }

                unit.setLastUpdatedBy(updatedBy);
                unit.setLastUpdatedTime(now);
                unit.setNotes((unit.getNotes() != null ? unit.getNotes() : "") + "\nUsed " + remainingRequest +
                        "ml for: " + request.getReason() + " on " + formattedDateTime);

                remainingRequest = 0.0;
            } else {
                // Nếu đơn vị này không đủ
                remainingRequest -= unit.getQuantity();
                unit.setStatus("USED");
                unit.setUsedQuantity(unit.getQuantity());
                unit.setQuantity(0.0);
                unit.setNotes((unit.getNotes() != null ? unit.getNotes() : "") + "\nFully used for: " +
                        request.getReason() + " on " + formattedDateTime);
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
                .lastUpdatedTime(inventory.getLastUpdatedTime())
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
                .orElseThrow(() -> new RuntimeException("Blood unit not found"));

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
            quantityDifference = -oldQuantity;
        }
        // Nếu trạng thái trước đó không phải AVAILABLE và bây giờ là AVAILABLE
        else if (!"AVAILABLE".equals(oldStatus) && "AVAILABLE".equals(newStatus)) {
            quantityDifference = newQuantity;
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
                .orElseThrow(() -> new RuntimeException("Blood unit not found"));

        // Nếu đơn vị máu còn khả dụng, cập nhật lô trước khi xóa
        if ("AVAILABLE".equals(inventory.getStatus())) {
            BloodType bloodType = inventory.getBloodType();
            Double quantity = inventory.getQuantity();

            // Cập nhật lô
            updateBatchAfterInventoryChange(bloodType, quantity, 0.0, "AVAILABLE", "DELETED", deletedBy);
        }

        // Ghi log trước khi xóa
        log.info("Delete blood unit ID {} (type: {}, quantity: {}) by {}",
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
                .orElseThrow(() -> new RuntimeException("Blood batch not found"));

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
                .orElseThrow(() -> new RuntimeException("Blood batch not found"));

        // Ghi log trước khi xóa
        log.info("Delete blood batch ID {} (type: {}, quantity: {}) by {}",
                batchId, batch.getBloodType(), batch.getTotalQuantity(), deletedBy);

        batchRepository.delete(batch);
    }

    /**
     * Lấy lịch sử sử dụng máu
     */
    public List<BloodInventoryDetailDTO> getBloodUsageHistory(BloodType bloodType, LocalDateTime startDate, LocalDateTime endDate) {
        List<BloodInventory> usageHistory;

        if (bloodType != null) {
            usageHistory = inventoryRepository.findUsageHistoryByBloodType(bloodType, startDate, endDate);
        } else {
            usageHistory = inventoryRepository.findAllUsageHistory(startDate, endDate);
        }

        return usageHistory.stream()
                .map(this::mapToDetailDTO)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getBloodUsageStatistics(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> statistics = new HashMap<>();

        // Lấy thống kê theo từng nhóm máu
        List<Object[]> usageStats = inventoryRepository.getUsageStatsByDateRange(startDate, endDate);

        // Tính tổng lượng máu đã sử dụng
        double totalUsed = 0.0;
        Map<String, Double> usageByBloodType = new HashMap<>();

        for (Object[] stat : usageStats) {
            BloodType bloodType = (BloodType) stat[0];

            Double amount = 0.0;
            if (stat[1] != null) {
                amount = ((Number) stat[1]).doubleValue();
            }

            log.info("Blood type {} used: {} ml", bloodType, amount);
            usageByBloodType.put(bloodType.toString(), amount);
            totalUsed += amount;
        }

        statistics.put("totalUsed", totalUsed);
        statistics.put("usageByBloodType", usageByBloodType);

        Map<String, Map<String, Object>> bloodTypeDetails = new HashMap<>();

        for (BloodType bloodType : BloodType.values()) {
            Map<String, Object> detail = new HashMap<>();

            Double amount = inventoryRepository.getUsageAmountByBloodTypeAndDateRange(bloodType, startDate, endDate);
            if (amount == null) amount = 0.0;

            Integer count = inventoryRepository.getUsageCountByBloodTypeAndDateRange(bloodType, startDate, endDate);
            if (count == null) count = 0;

            detail.put("amount", amount);
            detail.put("count", count);
            detail.put("units", amount / 350.0);

            bloodTypeDetails.put(bloodType.toString(), detail);
        }

        statistics.put("bloodTypeDetails", bloodTypeDetails);
        statistics.put("startDate", startDate);
        statistics.put("endDate", endDate);

        return statistics;
    }

    /**
     * Tạo báo cáo PDF về lịch sử sử dụng máu
     */
    public FileSystemResource generateUsagePdfReport(BloodType bloodType, LocalDateTime startDate, LocalDateTime endDate) {
        try {
            List<BloodInventoryDetailDTO> usageHistory = getBloodUsageHistory(bloodType, startDate, endDate);
            Map<String, Object> statistics = getBloodUsageStatistics(startDate, endDate);

            File tempFile = File.createTempFile("blood-usage-report", ".pdf");

            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, new FileOutputStream(tempFile));

            document.open();

            com.itextpdf.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Paragraph title = new Paragraph("Blood Usage History Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph("\nPeriod: " +
                    startDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + " - " +
                    endDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));

            if (bloodType != null) {
                document.add(new Paragraph("Blood type: " + bloodType.toString()));
            }

            document.add(new Paragraph("\n"));

            document.add(new Paragraph("Overview statistics:", FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
            document.add(new Paragraph("Total blood used: " + statistics.get("totalUsed") + " ml"));
            document.add(new Paragraph("Usage count: " + usageHistory.size()));
            document.add(new Paragraph("\n"));

            PdfPTable statsTable = new PdfPTable(4);
            statsTable.setWidthPercentage(100);

            statsTable.addCell("Blood type");
            statsTable.addCell("Quantity (ml)");
            statsTable.addCell("Usage count");
            statsTable.addCell("Blood units");

            Map<String, Map<String, Object>> bloodTypeDetails =
                    (Map<String, Map<String, Object>>) statistics.get("bloodTypeDetails");

            for (Map.Entry<String, Map<String, Object>> entry : bloodTypeDetails.entrySet()) {
                if (bloodType != null && !entry.getKey().equals(bloodType.toString())) {
                    continue;
                }

                Map<String, Object> detail = entry.getValue();
                Double amount = (Double) detail.get("amount");
                if (amount > 0) {
                    statsTable.addCell(entry.getKey());
                    statsTable.addCell(String.format("%.0f", amount));
                    statsTable.addCell(String.valueOf(detail.get("count")));
                    statsTable.addCell(String.format("%.1f", (Double) detail.get("units")));
                }
            }

            document.add(statsTable);
            document.add(new Paragraph("\n"));

            document.add(new Paragraph("Usage history details:", FontFactory.getFont(FontFactory.HELVETICA_BOLD)));

            PdfPTable detailTable = new PdfPTable(6);
            detailTable.setWidthPercentage(100);

            detailTable.addCell("ID");
            detailTable.addCell("Blood type");
            detailTable.addCell("Quantity");
            detailTable.addCell("Usage date");
            detailTable.addCell("Source");
            detailTable.addCell("Notes");

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            for (BloodInventoryDetailDTO item : usageHistory) {
                detailTable.addCell(item.getId());
                detailTable.addCell(item.getBloodType().toString());
                detailTable.addCell(String.format("%.0f ml", item.getQuantity()));
                detailTable.addCell(item.getLastUpdatedTime() != null ?
                        item.getLastUpdatedTime().format(formatter) : "");
                detailTable.addCell(item.getSource() != null ? item.getSource() : "");
                detailTable.addCell(item.getNotes() != null ? item.getNotes() : "");
            }

            document.add(detailTable);

            document.close();

            return new FileSystemResource(tempFile);
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF report: " + e.getMessage(), e);
        }
    }

    /**
     * Tạo báo cáo Excel về lịch sử sử dụng máu
     */
    public FileSystemResource generateUsageExcelReport(BloodType bloodType, LocalDateTime startDate, LocalDateTime endDate) {
        try {
            List<BloodInventoryDetailDTO> usageHistory = getBloodUsageHistory(bloodType, startDate, endDate);
            Map<String, Object> statistics = getBloodUsageStatistics(startDate, endDate);

            XSSFWorkbook workbook = new XSSFWorkbook();

            XSSFSheet statsSheet = workbook.createSheet("Statistics");

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            Row titleRow = statsSheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("BLOOD USAGE HISTORY REPORT");
            titleCell.setCellStyle(headerStyle);

            Row dateRow = statsSheet.createRow(1);
            dateRow.createCell(0).setCellValue("Period: " +
                    startDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + " - " +
                    endDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

            if (bloodType != null) {
                Row bloodTypeRow = statsSheet.createRow(2);
                bloodTypeRow.createCell(0).setCellValue("Blood type: " + bloodType.toString());
            }

            int rowNum = bloodType != null ? 3 : 2;

            Row overviewHeaderRow = statsSheet.createRow(rowNum++);
            overviewHeaderRow.createCell(0).setCellValue("OVERVIEW STATISTICS");

            Row totalRow = statsSheet.createRow(rowNum++);
            totalRow.createCell(0).setCellValue("Total blood used (ml)");
            totalRow.createCell(1).setCellValue(Double.parseDouble(statistics.get("totalUsed").toString()));

            Row countRow = statsSheet.createRow(rowNum++);
            countRow.createCell(0).setCellValue("Usage count");
            countRow.createCell(1).setCellValue(usageHistory.size());

            rowNum++;
            Row statsHeaderRow = statsSheet.createRow(rowNum++);
            statsHeaderRow.createCell(0).setCellValue("Blood type");
            statsHeaderRow.createCell(1).setCellValue("Quantity (ml)");
            statsHeaderRow.createCell(2).setCellValue("Usage count");
            statsHeaderRow.createCell(3).setCellValue("Blood units");

            Map<String, Map<String, Object>> bloodTypeDetails =
                    (Map<String, Map<String, Object>>) statistics.get("bloodTypeDetails");

            for (Map.Entry<String, Map<String, Object>> entry : bloodTypeDetails.entrySet()) {
                if (bloodType != null && !entry.getKey().equals(bloodType.toString())) {
                    continue;
                }

                Map<String, Object> detail = entry.getValue();
                Double amount = (Double) detail.get("amount");

                if (amount > 0) {
                    Row dataRow = statsSheet.createRow(rowNum++);
                    dataRow.createCell(0).setCellValue(entry.getKey());
                    dataRow.createCell(1).setCellValue(amount);
                    dataRow.createCell(2).setCellValue((Integer) detail.get("count"));
                    dataRow.createCell(3).setCellValue((Double) detail.get("units"));
                }
            }

            for (int i = 0; i < 4; i++) {
                statsSheet.autoSizeColumn(i);
            }

            XSSFSheet detailSheet = workbook.createSheet("Details");

            Row detailHeaderRow = detailSheet.createRow(0);
            detailHeaderRow.createCell(0).setCellValue("ID");
            detailHeaderRow.createCell(1).setCellValue("Blood type");
            detailHeaderRow.createCell(2).setCellValue("Quantity (ml)");
            detailHeaderRow.createCell(3).setCellValue("Usage date");
            detailHeaderRow.createCell(4).setCellValue("Source");
            detailHeaderRow.createCell(5).setCellValue("Donor");
            detailHeaderRow.createCell(6).setCellValue("Notes");

            for (int i = 0; i < 7; i++) {
                detailHeaderRow.getCell(i).setCellStyle(headerStyle);
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            rowNum = 1;
            for (BloodInventoryDetailDTO item : usageHistory) {
                Row row = detailSheet.createRow(rowNum++);
                row.createCell(0).setCellValue(item.getId());
                row.createCell(1).setCellValue(item.getBloodType().toString());
                row.createCell(2).setCellValue(item.getQuantity());
                row.createCell(3).setCellValue(item.getLastUpdatedTime() != null ?
                        item.getLastUpdatedTime().format(formatter) : "");
                row.createCell(4).setCellValue(item.getSource() != null ? item.getSource() : "");
                row.createCell(5).setCellValue(item.getDonorName() != null ? item.getDonorName() : "");
                row.createCell(6).setCellValue(item.getNotes() != null ? item.getNotes() : "");
            }

            for (int i = 0; i < 7; i++) {
                detailSheet.autoSizeColumn(i);
            }

            File tempFile = File.createTempFile("blood-usage-report", ".xlsx");
            FileOutputStream fileOut = new FileOutputStream(tempFile);
            workbook.write(fileOut);
            fileOut.close();
            workbook.close();

            return new FileSystemResource(tempFile);
        } catch (Exception e) {
            log.error("Error generating Excel report", e);
            throw new RuntimeException("Error generating Excel report: " + e.getMessage(), e);
        }
    }
}