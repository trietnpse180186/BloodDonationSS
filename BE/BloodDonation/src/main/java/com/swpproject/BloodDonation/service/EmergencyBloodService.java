package com.swpproject.BloodDonation.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.swpproject.BloodDonation.dto.request.EmergencyBloodRequestDTO;
import com.swpproject.BloodDonation.dto.response.EmergencyBloodResponseDTO;
import com.swpproject.BloodDonation.dto.response.EmergencyDonorDTO;
import com.swpproject.BloodDonation.dto.response.EmergencyStatisticsDTO;
import com.swpproject.BloodDonation.entity.EmergencyBloodRequest;
import com.swpproject.BloodDonation.entity.EmergencyDonation;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.enums.BloodType;
import com.swpproject.BloodDonation.enums.BloodTypeCategory;
import com.swpproject.BloodDonation.enums.EmergencyDonationStatus;
import com.swpproject.BloodDonation.enums.EmergencyStatus;
import com.swpproject.BloodDonation.repository.EmergencyBloodRequestRepository;
import com.swpproject.BloodDonation.repository.EmergencyDonationRepository;
import com.swpproject.BloodDonation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service quản lý yêu cầu hiến máu khẩn cấp
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmergencyBloodService {

    private final EmergencyBloodRequestRepository emergencyRepository;
    private final EmergencyDonationRepository donationRepository;
    private final UserRepository userRepository;
    private final WebSocketNotificationService webSocketNotificationService;
    private final UserLocationService userLocationService;
    private final NotificationEventPublisher eventPublisher;


    @Value("${app.url:http://localhost:3000}")
    private String appUrl;

    /**
     * Kiểm tra xem nhóm máu có phải là hiếm không
     */
    public boolean isRareBloodType(BloodType bloodType) {
        if (bloodType == null) return false;

        switch (bloodType) {
            case O_NEGATIVE:
            case A_NEGATIVE:
            case B_NEGATIVE:
            case AB_NEGATIVE:
                return true;
            default:
                return false;
        }
    }

    /**
     * Phân loại nhóm máu theo mức độ phổ biến
     */
    public BloodTypeCategory getBloodTypeCategory(BloodType bloodType) {
        if (bloodType == null) return BloodTypeCategory.COMMON;

        switch (bloodType) {
            case O_POSITIVE:
            case A_POSITIVE:
            case B_POSITIVE:
                return BloodTypeCategory.COMMON;

            case AB_POSITIVE:
                return BloodTypeCategory.UNCOMMON;

            case O_NEGATIVE:
            case A_NEGATIVE:
            case B_NEGATIVE:
                return BloodTypeCategory.RARE;

            case AB_NEGATIVE:
                return BloodTypeCategory.VERY_RARE;

            default:
                return BloodTypeCategory.COMMON;
        }
    }

    /**
     * Tạo mới yêu cầu hiến máu khẩn cấp
     */
    @Transactional
    public EmergencyBloodResponseDTO createEmergencyRequest(EmergencyBloodRequestDTO dto, String staffId) {
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        // Nếu không có thời gian hết hạn, đặt mặc định 24 giờ
        LocalDateTime expiryTime = dto.getExpirationTime();
        if (expiryTime == null) {
            expiryTime = LocalDateTime.now().plusHours(24);
        }

        // Kiểm tra nhóm máu hiếm
        boolean isRareBlood = isRareBloodType(dto.getBloodTypeNeeded());
        String priority = dto.getPriority();

        // Nếu là nhóm máu hiếm và chưa có priority
        if (isRareBlood && (priority == null || priority.isEmpty())) {
            priority = "HIGH";
        } else if (priority == null || priority.isEmpty()) {
            priority = "NORMAL";
        }

        // Nếu là nhóm máu hiếm, tăng thời gian hết hạn lên 48h
        if (isRareBlood) {
            expiryTime = LocalDateTime.now().plusHours(48);
        }

        // Tạo yêu cầu mới
        EmergencyBloodRequest request = EmergencyBloodRequest.builder()
                .requestId(UUID.randomUUID().toString())
                .hospitalName(dto.getHospitalName())
                .address(dto.getAddress())
                .contactPerson(dto.getContactPerson())
                .contactPhone(dto.getContactPhone())
                .description(dto.getDescription())
                .bloodTypeNeeded(dto.getBloodTypeNeeded())
                .unitsNeeded(dto.getUnitsNeeded())
                .requestTime(LocalDateTime.now())
                .expirationTime(expiryTime)
                .status(EmergencyStatus.ACTIVE)
                .isRareBloodType(isRareBlood)
                .priority(priority)
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .createdBy(staff)
                .lastUpdatedTime(LocalDateTime.now())
                .lastUpdatedBy(staff.getFullName())
                .donations(new ArrayList<>())
                .build();

        EmergencyBloodRequest savedRequest = emergencyRepository.save(request);

        // Gửi thông báo đến người dùng có nhóm máu phù hợp
        notifyEligibleDonors(savedRequest);

        // Nếu có thông tin vị trí, thông báo cho người dùng gần đó
        //notifyNearbyDonors(savedRequest);

        return mapToResponseDTO(savedRequest);
    }

    /**
     * Cập nhật thông tin yêu cầu hiến máu khẩn cấp
     */
    @Transactional
    public EmergencyBloodResponseDTO updateEmergencyRequest(String requestId, EmergencyBloodRequestDTO dto, String staffId) {
        EmergencyBloodRequest request = emergencyRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Emergency request not found"));

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        // Chỉ cập nhật các trường được phép sau khi tạo
        if (dto.getHospitalName() != null) {
            request.setHospitalName(dto.getHospitalName());
        }

        if (dto.getAddress() != null) {
            request.setAddress(dto.getAddress());
        }

        if (dto.getContactPerson() != null) {
            request.setContactPerson(dto.getContactPerson());
        }

        if (dto.getContactPhone() != null) {
            request.setContactPhone(dto.getContactPhone());
        }

        if (dto.getDescription() != null) {
            request.setDescription(dto.getDescription());
        }

        if (dto.getExpirationTime() != null) {
            request.setExpirationTime(dto.getExpirationTime());
        }

        if (dto.getPriority() != null) {
            request.setPriority(dto.getPriority());
        }

        request.setLastUpdatedTime(LocalDateTime.now());
        request.setLastUpdatedBy(staff.getFullName());

        // Không cho phép thay đổi nhóm máu và số lượng sau khi tạo
        // vì điều này có thể ảnh hưởng đến các đăng ký hiện có

        EmergencyBloodRequest savedRequest = emergencyRepository.save(request);

        // Thông báo cho những người đã đăng ký về việc cập nhật
        notifyDonorsAboutUpdate(savedRequest);

        return mapToResponseDTO(savedRequest);
    }

    /**
     * Thông báo cho người đã đăng ký về việc cập nhật thông tin yêu cầu
     */
    private void notifyDonorsAboutUpdate(EmergencyBloodRequest request) {
        List<User> registeredDonors = request.getDonations().stream()
                .map(EmergencyDonation::getDonor)
                .collect(Collectors.toList());

        for (User donor : registeredDonors) {
            String title = "Cập nhật yêu cầu hiến máu khẩn cấp";
            String message = "Yêu cầu hiến máu tại " + request.getHospitalName() +
                    " đã được cập nhật. Vui lòng kiểm tra thông tin mới nhất.";
            String actionUrl = "/emergency/" + request.getRequestId();

            webSocketNotificationService.sendDirectNotification(
                    donor.getUserID(),
                    title,
                    message,
                    actionUrl,
                    "EMERGENCY_UPDATED",
                    "NORMAL"
            );
        }
    }

        private void notifyEligibleDonors(EmergencyBloodRequest request) {
            // Find users with matching blood type
            List<User> eligibleDonors = userRepository.findByBloodType(request.getBloodTypeNeeded());

            String title = request.isRareBloodType() ?
                    "EMERGENCY BLOOD REQUEST" :
                    "Emergency Blood Request";

            String message = "Urgent need for blood type " + request.getBloodTypeNeeded() +
                    " at " + request.getHospitalName(   ) + ".\n" +
                    "Address: " + request.getAddress() + "\n" +
                    "Contact Person: " + request.getContactPerson() + "\n" +
                    "Contact Phone: " + request.getContactPhone() + "\n" +
                    "Units Needed: " + request.getUnitsNeeded() + "\n" +
                    "Description: " + request.getDescription() + "\n" +
                    (request.isRareBloodType() ?
                            "Your blood type is rare and especially needed for this situation!" :
                            "Every unit of blood is important, please help if you can!") +
                    "\n\nRequest ID: " + request.getRequestId();

            String actionUrl = "/emergency/" + request.getRequestId();

            log.info("Sending notifications to {} eligible donors", eligibleDonors.size());

            // Send notifications via WebSocket and Email
            for (User donor : eligibleDonors) {
                eventPublisher.publishNotificationCreatedEvent(
                        donor.getUserID(),
                        title,
                        message,
                        actionUrl,
                        request.isRareBloodType() ? "RARE_BLOOD_REQUEST" : "EMERGENCY_REQUEST",
                        request.getPriority()
                );
            }
        }

    /**
     * Send notifications to nearby users
     */
    private void notifyNearbyDonors(EmergencyBloodRequest request) {
        if (request.getLatitude() == null || request.getLongitude() == null) {
            log.warn("No location information for this emergency request");
            return;
        }

        // Search radius: 10km
        double radiusKm = 10.0;

        String title = "Emergency blood donation request near you!";
        String message = "Urgent need for blood type " + request.getBloodTypeNeeded() +
                " at " + request.getHospitalName() + " near your location. " +
                "Your help could save lives!";
        String actionUrl = "/emergency/" + request.getRequestId();

        // Send notifications to users within radius
        webSocketNotificationService.notifyNearbyUsers(
                request.getLatitude(),
                request.getLongitude(),
                radiusKm,
                title,
                message,
                actionUrl,
                "EMERGENCY_NEARBY",
                request.getBloodTypeNeeded().toString() // Prioritize matching blood type
        );

        log.info("Notifications sent to users within {}km radius", radiusKm);
    }

    /**
     * Lấy danh sách các yêu cầu hiến máu khẩn cấp đang hoạt động
     */
    public List<EmergencyBloodResponseDTO> getActiveEmergencyRequests() {
        return emergencyRepository.findByStatusAndExpirationTimeAfter(
                        EmergencyStatus.ACTIVE,
                        LocalDateTime.now())
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách tất cả các yêu cầu hiến máu khẩn cấp
     */
    public List<EmergencyBloodResponseDTO> getAllEmergencyRequests() {
        return emergencyRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy thông tin chi tiết một yêu cầu hiến máu khẩn cấp
     */
    public EmergencyBloodResponseDTO getEmergencyRequestById(String requestId) {
        EmergencyBloodRequest request = emergencyRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Emergency request not found"));
        return mapToResponseDTO(request);
    }

    /**
     * Người dùng đăng ký hiến máu cho một yêu cầu khẩn cấp
     */
    @Transactional
    public EmergencyDonorDTO respondToEmergencyRequest(String requestId, String donorId) {
        EmergencyBloodRequest request = emergencyRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Emergency request not found"));

        if (request.getStatus() != EmergencyStatus.ACTIVE) {
            throw new RuntimeException("This emergency request is no longer active");
        }

        User donor = userRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        // Kiểm tra xem người dùng đã đăng ký chưa
        if (donationRepository.existsByEmergencyRequestRequestIdAndDonorUserID(requestId, donorId)) {
            throw new RuntimeException("You have already responded to this request");
        }

        // Tính khoảng cách nếu có thông tin địa lý
        Double donorDistance = null;
        if (donor.getLatitude() != null && donor.getLongitude() != null &&
                request.getLatitude() != null && request.getLongitude() != null) {

            donorDistance = userLocationService.calculateDistance(
                    donor.getLatitude(), donor.getLongitude(),
                    request.getLatitude(), request.getLongitude()
            );
        }

        // Tạo đăng ký mới
        EmergencyDonation donation = EmergencyDonation.builder()
                .id(UUID.randomUUID().toString())
                .emergencyRequest(request)
                .donor(donor)
                .responseTime(LocalDateTime.now())
                .status(EmergencyDonationStatus.CONFIRMED)
                .donorDistance(donorDistance)
                .lastUpdatedTime(LocalDateTime.now())
                .build();

        EmergencyDonation savedDonation = donationRepository.save(donation);

        // Kiểm tra xem đã đủ người đăng ký chưa
        Integer confirmedDonors = donationRepository.countActiveResponsesByRequestId(requestId);
        if (confirmedDonors >= request.getUnitsNeeded()) {
            request.setStatus(EmergencyStatus.FULFILLED);
            emergencyRepository.save(request);
        }

        // Thông báo cho nhân viên về người hiến máu mới
        notifyStaffAboutNewDonor(request, donor);

        return EmergencyDonorDTO.builder()
                .donationId(savedDonation.getId())
                .donorId(donor.getUserID())
                .donorName(donor.getFullName())
                .phoneNumber(donor.getPhoneNumber())
                .bloodType(donor.getBloodType().toString())
                .status(savedDonation.getStatus())
                .responseTime(savedDonation.getResponseTime())
                .distance(donorDistance)
                .requestId(request.getRequestId())
                .hospitalName(request.getHospitalName())
                .hospitalAddress(request.getAddress())
                .requestStatus(request.getStatus())
                .requestDate(request.getRequestTime())
                .build();
    }

    /**
     * Thông báo cho nhân viên về người hiến máu mới đăng ký
     */
    private void notifyStaffAboutNewDonor(EmergencyBloodRequest request, User donor) {
        User staff = request.getCreatedBy();

        String title = "Người hiến máu mới đăng ký";
        String message = donor.getFullName() + " đã đăng ký hiến máu cho yêu cầu khẩn cấp tại " +
                request.getHospitalName();
        String actionUrl = "/staff/emergency/" + request.getRequestId();

        webSocketNotificationService.sendDirectNotification(
                staff.getUserID(),
                title,
                message,
                actionUrl,
                "EMERGENCY_RESPONSE",
                "HIGH"
        );
    }

    /**
     * Cập nhật trạng thái của đăng ký hiến máu
     */
    @Transactional
    public void updateDonationStatus(String donationId, EmergencyDonationStatus newStatus, String notes, String staffId) {
        EmergencyDonation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Emergency donation not found"));

        donation.setStatus(newStatus);

        if (notes != null && !notes.trim().isEmpty()) {
            donation.setStaffNotes(notes);
        }

        // Cập nhật thông tin người cập nhật
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        donation.setLastUpdatedBy(staff);
        donation.setLastUpdatedTime(LocalDateTime.now());

        if (newStatus == EmergencyDonationStatus.COMPLETED) {
            donation.setDonationTime(LocalDateTime.now());

            // Cập nhật trạng thái yêu cầu nếu đã đủ người hiến
            checkRequestCompletion(donation.getEmergencyRequest());

            // Thông báo cho người hiến về việc hoàn thành
            notifyDonorAboutCompletion(donation);
        }

        donationRepository.save(donation);
    }

    /**
     * Kiểm tra xem yêu cầu đã hoàn thành chưa
     */
    private void checkRequestCompletion(EmergencyBloodRequest request) {
        long completedDonations = request.getDonations().stream()
                .filter(d -> d.getStatus() == EmergencyDonationStatus.COMPLETED)
                .count();

        if (completedDonations >= request.getUnitsNeeded()) {
            request.setStatus(EmergencyStatus.COMPLETED);
            emergencyRepository.save(request);
        }
    }

    /**
     * Thông báo cho người hiến về việc đã hoàn thành hiến máu
     */
    private void notifyDonorAboutCompletion(EmergencyDonation donation) {
        User donor = donation.getDonor();
        EmergencyBloodRequest request = donation.getEmergencyRequest();

        String title = "Cảm ơn bạn đã hiến máu!";
        String message = "Chúng tôi xác nhận bạn đã hoàn thành hiến máu tại " +
                request.getHospitalName() + ". Cảm ơn sự đóng góp của bạn.";
        String actionUrl = "/donor/certificates";

        webSocketNotificationService.sendDirectNotification(
                donor.getUserID(),
                title,
                message,
                actionUrl,
                "EMERGENCY_FULFILLED",
                "NORMAL"
        );
    }

    /**
     * Hủy yêu cầu hiến máu khẩn cấp
     */
    @Transactional
    public void cancelEmergencyRequest(String requestId, String reason, String staffId) {
        EmergencyBloodRequest request = emergencyRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Emergency request not found"));

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        request.setStatus(EmergencyStatus.CANCELLED);
        request.setLastUpdatedTime(LocalDateTime.now());
        request.setLastUpdatedBy(staff.getFullName());
        emergencyRepository.save(request);

        // Thông báo cho tất cả người dùng đã đăng ký
        notifyRequestCancelled(request, reason);
    }

    /**
     * Thông báo cho người đã đăng ký về việc hủy yêu cầu
     */
    private void notifyRequestCancelled(EmergencyBloodRequest request, String reason) {
        List<User> respondedDonors = request.getDonations().stream()
                .map(EmergencyDonation::getDonor)
                .collect(Collectors.toList());

        for (User donor : respondedDonors) {
            String title = "Yêu cầu hiến máu đã bị hủy";
            String message = "Yêu cầu hiến máu khẩn cấp tại " + request.getHospitalName() +
                    " đã bị hủy. " + (reason != null ? "Lý do: " + reason : "Cảm ơn bạn đã quan tâm.");

            webSocketNotificationService.sendDirectNotification(
                    donor.getUserID(),
                    title,
                    message,
                    null,
                    "EMERGENCY_CANCELLED",
                    "NORMAL"
            );
        }
    }

    /**
     * Chuyển đổi từ entity sang DTO
     */
    private EmergencyBloodResponseDTO mapToResponseDTO(EmergencyBloodRequest request) {
        // Đếm số lượng đơn vị máu đã hiến thành công
        int unitsDonated = (int) request.getDonations().stream()
                .filter(donation -> donation.getStatus() == EmergencyDonationStatus.COMPLETED)
                .count();

        // Chuyển đổi danh sách người hiến máu thành DTO
        List<EmergencyDonorDTO> donors = request.getDonations().stream()
                .map(donation -> EmergencyDonorDTO.builder()
                        .donationId(donation.getId())
                        .donorId(donation.getDonor().getUserID())
                        .donorName(donation.getDonor().getFullName())
                        .phoneNumber(donation.getDonor().getPhoneNumber())
                        .bloodType(donation.getDonor().getBloodType().toString())
                        .status(donation.getStatus())
                        .responseTime(donation.getResponseTime())
                        .donationTime(donation.getDonationTime())
                        .notes(donation.getNotes())
                        .staffNotes(donation.getStaffNotes())
                        .distance(donation.getDonorDistance())
                        .lastUpdatedTime(donation.getLastUpdatedTime())
                        .lastUpdatedBy(donation.getLastUpdatedBy() != null ?
                                donation.getLastUpdatedBy().getFullName() : null)
                        .build())
                .collect(Collectors.toList());

        return EmergencyBloodResponseDTO.builder()
                .requestId(request.getRequestId())
                .hospitalName(request.getHospitalName())
                .address(request.getAddress())
                .contactPerson(request.getContactPerson())
                .contactPhone(request.getContactPhone())
                .description(request.getDescription())
                .bloodTypeNeeded(request.getBloodTypeNeeded())
                .bloodTypeCategory(getBloodTypeCategory(request.getBloodTypeNeeded()))
                .unitsNeeded(request.getUnitsNeeded())
                .unitsDonated(unitsDonated)
                .requestTime(request.getRequestTime())
                .expirationTime(request.getExpirationTime())
                .status(request.getStatus())
                .isRareBloodType(request.isRareBloodType())
                .priority(request.getPriority())
                .donors(donors)
                .createdByName(request.getCreatedBy().getFullName())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .lastUpdatedTime(request.getLastUpdatedTime())
                .lastUpdatedBy(request.getLastUpdatedBy())
                .build();
    }

    /**
     * Lấy lịch sử đăng ký hiến máu khẩn cấp của người dùng
     */
    public List<EmergencyDonorDTO> getUserDonationHistory(String userId) {
        User donor = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<EmergencyDonation> donations = donationRepository.findByDonor(donor);

        return donations.stream()
                .map(donation -> {
                    EmergencyBloodRequest request = donation.getEmergencyRequest();

                    return EmergencyDonorDTO.builder()
                            .donationId(donation.getId())
                            .donorId(donor.getUserID())
                            .donorName(donor.getFullName())
                            .phoneNumber(donor.getPhoneNumber())
                            .bloodType(donor.getBloodType().toString())
                            .status(donation.getStatus())
                            .responseTime(donation.getResponseTime())
                            .donationTime(donation.getDonationTime())
                            .notes(donation.getNotes())
                            .staffNotes(donation.getStaffNotes())
                            .distance(donation.getDonorDistance())
                            // Thêm thông tin bệnh viện
                            .requestId(request.getRequestId())
                            .hospitalName(request.getHospitalName())
                            .hospitalAddress(request.getAddress())
                            .requestStatus(request.getStatus())
                            .requestDate(request.getRequestTime())
                            .lastUpdatedBy(donation.getLastUpdatedBy() != null ?
                                    donation.getLastUpdatedBy().getFullName() : null)
                            .lastUpdatedTime(donation.getLastUpdatedTime())
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Lấy thống kê về yêu cầu hiến máu khẩn cấp
     */
    public EmergencyStatisticsDTO getStatistics(String fromDateStr, String toDateStr) {
        // Xử lý ngày bắt đầu và kết thúc
        LocalDateTime fromDate = fromDateStr != null ?
                LocalDate.parse(fromDateStr).atStartOfDay() :
                LocalDateTime.now().minusMonths(1);

        LocalDateTime toDate = toDateStr != null ?
                LocalDate.parse(toDateStr).atTime(LocalTime.MAX) :
                LocalDateTime.now();

        // Lấy tất cả yêu cầu trong khoảng thời gian
        List<EmergencyBloodRequest> requests = emergencyRepository.findByRequestTimeBetween(fromDate, toDate);

        // Thống kê theo trạng thái
        int totalRequests = requests.size();
        int activeRequests = 0;
        int fulfilledRequests = 0;
        int completedRequests = 0;
        int cancelledRequests = 0;

        Map<String, Integer> requestsByBloodType = new HashMap<>();

        for (EmergencyBloodRequest request : requests) {
            switch (request.getStatus()) {
                case ACTIVE:
                    activeRequests++;
                    break;
                case FULFILLED:
                    fulfilledRequests++;
                    break;
                case COMPLETED:
                    completedRequests++;
                    break;
                case CANCELLED:
                    cancelledRequests++;
                    break;
            }

            // Thống kê theo nhóm máu
            String bloodType = request.getBloodTypeNeeded().toString();
            requestsByBloodType.put(bloodType, requestsByBloodType.getOrDefault(bloodType, 0) + 1);
        }

        // Thống kê đăng ký hiến máu
        List<Object[]> donationStats = donationRepository.countByStatusAndDateRange(fromDate, toDate);

        int totalDonationsRegistered = 0;
        int pendingDonations = 0;
        int confirmedDonations = 0;
        int completedDonations = 0;
        int noShowDonations = 0;
        int cancelledDonations = 0;

        for (Object[] stat : donationStats) {
            EmergencyDonationStatus status = (EmergencyDonationStatus) stat[0];
            Long count = (Long) stat[1];

            totalDonationsRegistered += count;

            switch (status) {
                case PENDING:
                    pendingDonations += count;
                    break;
                case CONFIRMED:
                    confirmedDonations += count;
                    break;
                case COMPLETED:
                    completedDonations += count;
                    break;
                case NO_SHOW:
                    noShowDonations += count;
                    break;
                case CANCELLED:
                    cancelledDonations += count;
                    break;
            }
        }

        // Tính tỷ lệ
        double completionRate = totalRequests > 0 ?
                (double) completedRequests / totalRequests * 100 : 0;

        double responseRate = totalRequests > 0 ?
                (double) totalDonationsRegistered / totalRequests : 0;

        // Tính thời gian phản hồi trung bình
        Map<String, Double> averageResponseTime = calculateAverageResponseTime(requests);

        return EmergencyStatisticsDTO.builder()
                .totalRequests(totalRequests)
                .activeRequests(activeRequests)
                .fulfilledRequests(fulfilledRequests)
                .completedRequests(completedRequests)
                .cancelledRequests(cancelledRequests)

                .totalDonationsRegistered(totalDonationsRegistered)
                .pendingDonations(pendingDonations)
                .confirmedDonations(confirmedDonations)
                .completedDonations(completedDonations)
                .noShowDonations(noShowDonations)
                .cancelledDonations(cancelledDonations)

                .completionRate(completionRate)
                .responseRate(responseRate)

                .requestsByBloodType(requestsByBloodType)
                .averageResponseTime(averageResponseTime)
                .build();
    }

    /**
     * Tính thời gian phản hồi trung bình cho mỗi nhóm máu
     */
    private Map<String, Double> calculateAverageResponseTime(List<EmergencyBloodRequest> requests) {
        Map<String, List<Long>> responseTimesByBloodType = new HashMap<>();

        for (EmergencyBloodRequest request : requests) {
            String bloodType = request.getBloodTypeNeeded().toString();

            for (EmergencyDonation donation : request.getDonations()) {
                if (donation.getResponseTime() != null) {
                    // Tính thời gian phản hồi tính bằng phút
                    long responseTimeMinutes = java.time.Duration.between(
                            request.getRequestTime(),
                            donation.getResponseTime()
                    ).toMinutes();

                    if (!responseTimesByBloodType.containsKey(bloodType)) {
                        responseTimesByBloodType.put(bloodType, new ArrayList<>());
                    }

                    responseTimesByBloodType.get(bloodType).add(responseTimeMinutes);
                }
            }
        }

        // Tính trung bình
        Map<String, Double> result = new HashMap<>();

        for (Map.Entry<String, List<Long>> entry : responseTimesByBloodType.entrySet()) {
            String bloodType = entry.getKey();
            List<Long> times = entry.getValue();

            if (!times.isEmpty()) {
                double average = times.stream()
                        .mapToLong(Long::longValue)
                        .average()
                        .orElse(0);

                result.put(bloodType, average);
            }
        }

        return result;
    }

    /**
     * Tạo báo cáo PDF về yêu cầu hiến máu khẩn cấp
     */
    public Resource generatePdfReport(String fromDateStr, String toDateStr) {
        try {
            // Lấy dữ liệu thống kê
            EmergencyStatisticsDTO statistics = getStatistics(fromDateStr, toDateStr);

            // Tạo document PDF
            Document document = new Document();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, baos);

            document.open();

            // Tiêu đề báo cáo
            com.itextpdf.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("BÁO CÁO YÊU CẦU HIẾN MÁU KHẨN CẤP", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            // Thời gian báo cáo
            com.itextpdf.text.Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            String dateRange = "Từ: " + (fromDateStr != null ? fromDateStr : "tháng trước") +
                    " đến: " + (toDateStr != null ? toDateStr : "hiện tại");
            Paragraph dateRangePara = new Paragraph(dateRange, normalFont);
            dateRangePara.setAlignment(Element.ALIGN_CENTER);
            document.add(dateRangePara);
            document.add(new Paragraph(" ")); // Khoảng trống

            // Tổng quan
            com.itextpdf.text.Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            document.add(new Paragraph("TỔNG QUAN", sectionFont));

            PdfPTable overviewTable = new PdfPTable(2);
            overviewTable.setWidthPercentage(100);
            overviewTable.addCell("Tổng số yêu cầu");
            overviewTable.addCell(String.valueOf(statistics.getTotalRequests()));
            overviewTable.addCell("Đang hoạt động");
            overviewTable.addCell(String.valueOf(statistics.getActiveRequests()));
            overviewTable.addCell("Đã đủ người đăng ký");
            overviewTable.addCell(String.valueOf(statistics.getFulfilledRequests()));
            overviewTable.addCell("Đã hoàn thành");
            overviewTable.addCell(String.valueOf(statistics.getCompletedRequests()));
            overviewTable.addCell("Đã hủy");
            overviewTable.addCell(String.valueOf(statistics.getCancelledRequests()));
            overviewTable.addCell("Tỷ lệ hoàn thành");
            overviewTable.addCell(String.format("%.2f%%", statistics.getCompletionRate()));
            document.add(overviewTable);

            document.add(new Paragraph(" ")); // Khoảng trống

            // Thống kê đăng ký
            document.add(new Paragraph("ĐĂNG KÝ HIẾN MÁU", sectionFont));

            PdfPTable donationTable = new PdfPTable(2);
            donationTable.setWidthPercentage(100);
            donationTable.addCell("Tổng số đăng ký");
            donationTable.addCell(String.valueOf(statistics.getTotalDonationsRegistered()));
            donationTable.addCell("Chờ xác nhận");
            donationTable.addCell(String.valueOf(statistics.getPendingDonations()));
            donationTable.addCell("Đã xác nhận");
            donationTable.addCell(String.valueOf(statistics.getConfirmedDonations()));
            donationTable.addCell("Đã hoàn thành");
            donationTable.addCell(String.valueOf(statistics.getCompletedDonations()));
            donationTable.addCell("Không đến");
            donationTable.addCell(String.valueOf(statistics.getNoShowDonations()));
            donationTable.addCell("Đã hủy");
            donationTable.addCell(String.valueOf(statistics.getCancelledDonations()));
            document.add(donationTable);

            document.add(new Paragraph(" ")); // Khoảng trống

            // Thống kê theo nhóm máu
            document.add(new Paragraph("THEO NHÓM MÁU", sectionFont));

            PdfPTable bloodTypeTable = new PdfPTable(3);
            bloodTypeTable.setWidthPercentage(100);
            bloodTypeTable.addCell("Nhóm máu");
            bloodTypeTable.addCell("Số yêu cầu");
            bloodTypeTable.addCell("Thời gian phản hồi trung bình (phút)");

            for (Map.Entry<String, Integer> entry : statistics.getRequestsByBloodType().entrySet()) {
                String bloodType = entry.getKey();
                Integer count = entry.getValue();
                Double avgTime = statistics.getAverageResponseTime().getOrDefault(bloodType, 0.0);

                bloodTypeTable.addCell(bloodType);
                bloodTypeTable.addCell(count.toString());
                bloodTypeTable.addCell(String.format("%.2f", avgTime));
            }

            document.add(bloodTypeTable);

            // Thời gian tạo báo cáo
            document.add(new Paragraph(" ")); // Khoảng trống
            Paragraph generated = new Paragraph(
                    "Báo cáo được tạo vào: " + LocalDateTime.now().format(
                            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")
                    ),
                    normalFont
            );
            generated.setAlignment(Element.ALIGN_RIGHT);
            document.add(generated);

            document.close();

            return new ByteArrayResource(baos.toByteArray());

        } catch (Exception e) {
            log.error("Lỗi khi tạo báo cáo PDF: {}", e.getMessage(), e);
            throw new RuntimeException("Không thể tạo báo cáo PDF: " + e.getMessage());
        }
    }

    /**
     * Tạo báo cáo Excel về yêu cầu hiến máu khẩn cấp
     */
    public Resource generateExcelReport(String fromDateStr, String toDateStr) {
        try {
            // Lấy dữ liệu thống kê
            EmergencyStatisticsDTO statistics = getStatistics(fromDateStr, toDateStr);

            // Lấy danh sách yêu cầu
            LocalDateTime fromDate = fromDateStr != null ?
                    LocalDate.parse(fromDateStr).atStartOfDay() :
                    LocalDateTime.now().minusMonths(1);

            LocalDateTime toDate = toDateStr != null ?
                    LocalDate.parse(toDateStr).atTime(LocalTime.MAX) :
                    LocalDateTime.now();

            List<EmergencyBloodRequest> requests = emergencyRepository.findByRequestTimeBetween(fromDate, toDate);

            // Tạo workbook Excel
            Workbook workbook = new XSSFWorkbook();

            // Tạo style cho header
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            // Trang 1: Tổng quan
            Sheet overviewSheet = workbook.createSheet("Tổng quan");

            // Tiêu đề
            Row titleRow = overviewSheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue("BÁO CÁO YÊU CẦU HIẾN MÁU KHẨN CẤP");
            titleCell.setCellStyle(headerStyle);

            // Thời gian báo cáo
            Row dateRow = overviewSheet.createRow(1);
            dateRow.createCell(0).setCellValue("Từ: " + (fromDateStr != null ? fromDateStr : "tháng trước") +
                    " đến: " + (toDateStr != null ? toDateStr : "hiện tại"));

            // Dữ liệu tổng quan
            Row headerRow = overviewSheet.createRow(3);
            headerRow.createCell(0).setCellValue("Chỉ số");
            headerRow.createCell(1).setCellValue("Giá trị");
            headerRow.getCell(0).setCellStyle(headerStyle);
            headerRow.getCell(1).setCellStyle(headerStyle);

            Row row1 = overviewSheet.createRow(4);
            row1.createCell(0).setCellValue("Tổng số yêu cầu");
            row1.createCell(1).setCellValue(statistics.getTotalRequests());

            Row row2 = overviewSheet.createRow(5);
            row2.createCell(0).setCellValue("Đang hoạt động");
            row2.createCell(1).setCellValue(statistics.getActiveRequests());

            Row row3 = overviewSheet.createRow(6);
            row3.createCell(0).setCellValue("Đã đủ người đăng ký");
            row3.createCell(1).setCellValue(statistics.getFulfilledRequests());

            Row row4 = overviewSheet.createRow(7);
            row4.createCell(0).setCellValue("Đã hoàn thành");
            row4.createCell(1).setCellValue(statistics.getCompletedRequests());

            Row row5 = overviewSheet.createRow(8);
            row5.createCell(0).setCellValue("Đã hủy");
            row5.createCell(1).setCellValue(statistics.getCancelledRequests());

            Row row6 = overviewSheet.createRow(9);
            row6.createCell(0).setCellValue("Tỷ lệ hoàn thành");
            row6.createCell(1).setCellValue(String.format("%.2f%%", statistics.getCompletionRate()));

            // Dữ liệu đăng ký
            Row donationHeader = overviewSheet.createRow(11);
            donationHeader.createCell(0).setCellValue("ĐĂNG KÝ HIẾN MÁU");
            donationHeader.getCell(0).setCellStyle(headerStyle);

            Row donationRow1 = overviewSheet.createRow(12);
            donationRow1.createCell(0).setCellValue("Tổng số đăng ký");
            donationRow1.createCell(1).setCellValue(statistics.getTotalDonationsRegistered());

            Row donationRow2 = overviewSheet.createRow(13);
            donationRow2.createCell(0).setCellValue("Chờ xác nhận");
            donationRow2.createCell(1).setCellValue(statistics.getPendingDonations());

            Row donationRow3 = overviewSheet.createRow(14);
            donationRow3.createCell(0).setCellValue("Đã xác nhận");
            donationRow3.createCell(1).setCellValue(statistics.getConfirmedDonations());

            Row donationRow4 = overviewSheet.createRow(15);
            donationRow4.createCell(0).setCellValue("Đã hoàn thành");
            donationRow4.createCell(1).setCellValue(statistics.getCompletedDonations());

            Row donationRow5 = overviewSheet.createRow(16);
            donationRow5.createCell(0).setCellValue("Không đến");
            donationRow5.createCell(1).setCellValue(statistics.getNoShowDonations());

            Row donationRow6 = overviewSheet.createRow(17);
            donationRow6.createCell(0).setCellValue("Đã hủy");
            donationRow6.createCell(1).setCellValue(statistics.getCancelledDonations());

            // Tạo sheet chi tiết các yêu cầu
            Sheet detailsSheet = workbook.createSheet("Chi tiết yêu cầu");

            // Header
            Row detailsHeader = detailsSheet.createRow(0);
            detailsHeader.createCell(0).setCellValue("ID");
            detailsHeader.createCell(1).setCellValue("Bệnh viện");
            detailsHeader.createCell(2).setCellValue("Nhóm máu");
            detailsHeader.createCell(3).setCellValue("Số lượng cần");
            detailsHeader.createCell(4).setCellValue("Số lượng đã hiến");
            detailsHeader.createCell(5).setCellValue("Trạng thái");
            detailsHeader.createCell(6).setCellValue("Thời gian tạo");
            detailsHeader.createCell(7).setCellValue("Thời gian hết hạn");

            // Đặt style cho header
            for (int i = 0; i < 8; i++) {
                detailsHeader.getCell(i).setCellStyle(headerStyle);
            }

            // Dữ liệu chi tiết
            for (int i = 0; i < requests.size(); i++) {
                EmergencyBloodRequest request = requests.get(i);
                EmergencyBloodResponseDTO dto = mapToResponseDTO(request);

                Row dataRow = detailsSheet.createRow(i + 1);
                dataRow.createCell(0).setCellValue(request.getRequestId());
                dataRow.createCell(1).setCellValue(request.getHospitalName());
                dataRow.createCell(2).setCellValue(request.getBloodTypeNeeded().toString());
                dataRow.createCell(3).setCellValue(request.getUnitsNeeded());
                dataRow.createCell(4).setCellValue(dto.getUnitsDonated());
                dataRow.createCell(5).setCellValue(request.getStatus().toString());
                dataRow.createCell(6).setCellValue(request.getRequestTime().toString());
                dataRow.createCell(7).setCellValue(request.getExpirationTime().toString());
            }

            // Tự động điều chỉnh cột
            for (int i = 0; i < 8; i++) {
                detailsSheet.autoSizeColumn(i);
            }

            // Xuất Excel
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            workbook.close();

            return new ByteArrayResource(baos.toByteArray());

        } catch (Exception e) {
            log.error("Lỗi khi tạo báo cáo Excel: {}", e.getMessage(), e);
            throw new RuntimeException("Không thể tạo báo cáo Excel: " + e.getMessage());
        }
    }


}