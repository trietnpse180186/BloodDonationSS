package com.swpproject.BloodDonation.dto.response;

import com.swpproject.BloodDonation.enums.EmergencyDonationStatus;
import com.swpproject.BloodDonation.enums.EmergencyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO thông tin người hiến máu đăng ký cho yêu cầu khẩn cấp
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyDonorDTO {
    private String donationId;
    private String donorId;
    private String donorName;
    private String phoneNumber;
    private String bloodType;
    private EmergencyDonationStatus status;
    private LocalDateTime responseTime;
    private LocalDateTime donationTime;
    private String notes;
    private String staffNotes;
    private Double distance;

    // Thông tin yêu cầu (cho lịch sử người dùng)
    private String requestId;
    private String hospitalName;
    private String hospitalAddress;
    private EmergencyStatus requestStatus;
    private LocalDateTime requestDate;
    private String lastUpdatedBy;
    private LocalDateTime lastUpdatedTime;

    private String checkInCode;
    private LocalDateTime checkInDeadline;
    private LocalDateTime checkInTime;
    private String checkInBy;
    private LocalDateTime checkOutTime;
    private String checkOutBy;
    private String checkOutNotes;
}