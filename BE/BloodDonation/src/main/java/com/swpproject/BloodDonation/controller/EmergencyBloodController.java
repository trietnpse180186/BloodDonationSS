package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.EmergencyBloodRequestDTO;
import com.swpproject.BloodDonation.dto.response.EmergencyBloodResponseDTO;
import com.swpproject.BloodDonation.dto.response.EmergencyDonorDTO;
import com.swpproject.BloodDonation.dto.response.EmergencyStatisticsDTO;
import com.swpproject.BloodDonation.entity.EmergencyBloodRequest;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.enums.EmergencyDonationStatus;
import com.swpproject.BloodDonation.repository.EmergencyBloodRequestRepository;
import com.swpproject.BloodDonation.service.EmergencyBloodService;
import com.swpproject.BloodDonation.service.NotificationEventPublisher;
import com.swpproject.BloodDonation.service.UserLocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
public class EmergencyBloodController {

    private final EmergencyBloodService emergencyService;
    private final EmergencyBloodRequestRepository emergencyRepository;
    private final UserLocationService userLocationService;
    private final NotificationEventPublisher eventPublisher;

    /**
     * Tạo yêu cầu hiến máu khẩn cấp mới
     */
    @PostMapping
    @PreAuthorize("hasAuthority('STAFF') or hasAuthority('ADMIN')")
    public ResponseEntity<EmergencyBloodResponseDTO> createEmergencyRequest(
            @RequestBody EmergencyBloodRequestDTO request,
            Authentication authentication) {

        Jwt jwt = (Jwt) authentication.getPrincipal();
        String staffId = jwt.getClaim("userId");

        EmergencyBloodResponseDTO response = emergencyService.createEmergencyRequest(request, staffId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Cập nhật thông tin yêu cầu hiến máu khẩn cấp
     */
    @PutMapping("/{requestId}")
    @PreAuthorize("hasAuthority('STAFF') or hasAuthority('ADMIN')")
    public ResponseEntity<EmergencyBloodResponseDTO> updateEmergencyRequest(
            @PathVariable String requestId,
            @RequestBody EmergencyBloodRequestDTO updateDTO,
            Authentication authentication) {

        Jwt jwt = (Jwt) authentication.getPrincipal();
        String staffId = jwt.getClaim("userId");

        EmergencyBloodResponseDTO updated = emergencyService.updateEmergencyRequest(requestId, updateDTO, staffId);
        return ResponseEntity.ok(updated);
    }

    /**
     * Lấy danh sách các yêu cầu đang hoạt động (công khai)
     */
    @GetMapping("/active")
    public ResponseEntity<List<EmergencyBloodResponseDTO>> getActiveEmergencyRequests() {
        return ResponseEntity.ok(emergencyService.getActiveEmergencyRequests());
    }

    /**
     * Lấy tất cả yêu cầu (chỉ cho staff/admin)
     */
    @GetMapping
    @PreAuthorize("hasAuthority('STAFF') or hasAuthority('ADMIN')")
    public ResponseEntity<List<EmergencyBloodResponseDTO>> getAllEmergencyRequests() {
        return ResponseEntity.ok(emergencyService.getAllEmergencyRequests());
    }

    /**
     * Lấy thông tin chi tiết của một yêu cầu
     */
    @GetMapping("/{requestId}")
    public ResponseEntity<EmergencyBloodResponseDTO> getEmergencyRequestById(
            @PathVariable String requestId) {
        return ResponseEntity.ok(emergencyService.getEmergencyRequestById(requestId));
    }

    /**
     * Đăng ký hiến máu cho một yêu cầu khẩn cấp
     */
    @PostMapping("/{requestId}/respond")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EmergencyDonorDTO> respondToEmergencyRequest(
            @PathVariable String requestId,
            Authentication authentication) {

        Jwt jwt = (Jwt) authentication.getPrincipal();
        String donorId = jwt.getClaim("userId");

        EmergencyDonorDTO response = emergencyService.respondToEmergencyRequest(requestId, donorId);
        return ResponseEntity.ok(response);
    }

    /**
     * Cập nhật trạng thái của đăng ký hiến máu
     */
    @PutMapping("/donations/{donationId}/status")
    @PreAuthorize("hasAuthority('STAFF') or hasAuthority('ADMIN')")
    public ResponseEntity<Void> updateDonationStatus(
            @PathVariable String donationId,
            @RequestParam EmergencyDonationStatus status,
            @RequestParam(required = false) String notes,
            Authentication authentication) {

        Jwt jwt = (Jwt) authentication.getPrincipal();
        String staffId = jwt.getClaim("userId");

        emergencyService.updateDonationStatus(donationId, status, notes, staffId);
        return ResponseEntity.ok().build();
    }

    /**
     * Hủy yêu cầu hiến máu khẩn cấp
     */
    @DeleteMapping("/{requestId}")
    @PreAuthorize("hasAuthority('STAFF') or hasAuthority('ADMIN')")
    public ResponseEntity<Void> cancelEmergencyRequest(
            @PathVariable String requestId,
            @RequestParam(required = false) String reason,
            Authentication authentication) {

        Jwt jwt = (Jwt) authentication.getPrincipal();
        String staffId = jwt.getClaim("userId");

        emergencyService.cancelEmergencyRequest(requestId, reason, staffId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Thông báo cho người dùng trong phạm vi gần
     */
    @PostMapping("/{requestId}/notify-nearby")
    @PreAuthorize("hasAuthority('STAFF') or hasAuthority('ADMIN')")
    public ResponseEntity<Integer> notifyNearbyUsers(
            @PathVariable String requestId,
            @RequestParam(defaultValue = "10.0") Double radiusKm) {

        EmergencyBloodRequest request = emergencyRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Emergency request not found"));

        if (request.getLatitude() == null || request.getLongitude() == null) {
            return ResponseEntity.badRequest().body(0);
        }

        String title = "Yêu cầu hiến máu khẩn cấp gần bạn!";
        String message = "Cần gấp nhóm máu " + request.getBloodTypeNeeded() +
                " tại " + request.getHospitalName() + " gần vị trí của bạn. " +
                "Sự giúp đỡ của bạn có thể cứu sống người khác!";
        String actionUrl = "/emergency/" + request.getRequestId();

        // Tìm người dùng trong bán kính và gửi thông báo
        List<User> nearbyUsers = userLocationService.findNearbyUsers(
                request.getLatitude(),
                request.getLongitude(),
                radiusKm,
                request.getBloodTypeNeeded().toString()
        );

        // Gửi thông báo qua WebSocket
        for (User user : nearbyUsers) {
            // Tính khoảng cách
            double distance = userLocationService.calculateDistance(
                    request.getLatitude(), request.getLongitude(),
                    user.getLatitude(), user.getLongitude()
            );

            String distanceMessage = message + "\n(Cách vị trí của bạn khoảng "
                    + String.format("%.1f", distance) + " km)";

            String priority = distance <= 5 ? "HIGH" : "NORMAL";

            // Sử dụng eventPublisher thay vì webSocketNotificationService
            eventPublisher.publishNotificationCreatedEvent(
                    user.getUserID(),
                    title,
                    distanceMessage,
                    actionUrl,
                    "EMERGENCY_NEARBY",
                    priority
            );
        }

        return ResponseEntity.ok(nearbyUsers.size());
    }

    /**
     * Lấy lịch sử đăng ký hiến máu khẩn cấp của người dùng
     */
    @GetMapping("/user/history")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EmergencyDonorDTO>> getUserDonationHistory(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = jwt.getClaim("userId");

        List<EmergencyDonorDTO> history = emergencyService.getUserDonationHistory(userId);
        return ResponseEntity.ok(history);
    }

    /**
     * Lấy thống kê về yêu cầu hiến máu khẩn cấp
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasAuthority('STAFF') or hasAuthority('ADMIN')")
    public ResponseEntity<EmergencyStatisticsDTO> getEmergencyStatistics(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        EmergencyStatisticsDTO statistics = emergencyService.getStatistics(fromDate, toDate);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Xuất báo cáo dưới dạng PDF
     */
    @GetMapping("/reports/pdf")
    @PreAuthorize("hasAuthority('STAFF') or hasAuthority('ADMIN')")
    public ResponseEntity<Resource> exportPdfReport(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        Resource pdfResource = emergencyService.generatePdfReport(fromDate, toDate);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=emergency-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfResource);
    }

    /**
     * Xuất báo cáo dưới dạng Excel
     */
    @GetMapping("/reports/excel")
    @PreAuthorize("hasAuthority('STAFF') or hasAuthority('ADMIN')")
    public ResponseEntity<Resource> exportExcelReport(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        Resource excelResource = emergencyService.generateExcelReport(fromDate, toDate);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=emergency-report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.ms-excel"))
                .body(excelResource);
    }
}