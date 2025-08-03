package com.swpproject.BloodDonation.entity;

import com.swpproject.BloodDonation.enums.EmergencyDonationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity lưu trữ thông tin đăng ký hiến máu khẩn cấp của người dùng
 */
@Entity
@Table(name = "emergency_donations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyDonation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "request_id")
    private EmergencyBloodRequest emergencyRequest;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private User donor;

    private LocalDateTime responseTime; // Thời gian người dùng phản hồi

    private LocalDateTime donationTime; // Thời gian hiến máu thực tế

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private EmergencyDonationStatus status = EmergencyDonationStatus.PENDING;

    @Column(columnDefinition = "NVARCHAR(1000)")
    private String notes; // Ghi chú từ người hiến hoặc nhân viên

    private Double donorDistance; // Khoảng cách từ người hiến đến địa điểm yêu cầu (nếu có)

    @Column(columnDefinition = "NVARCHAR(500)")
    private String staffNotes; // Ghi chú từ nhân viên

    @Column(name = "check_in_code")
    private String checkInCode;

    @Column(name = "check_in_deadline")
    private LocalDateTime checkInDeadline;

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    @Column(name = "check_in_by")
    private String checkInBy;

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    @Column(name = "check_out_by")
    private String checkOutBy;

    @Column(name = "check_out_notes")
    private String checkOutNotes;


    @Column(name = "last_updated_by")
    private String lastUpdatedBy; // Người cập nhật cuối cùng

    private LocalDateTime lastUpdatedTime; // Thời gian cập nhật cuối cùng
}