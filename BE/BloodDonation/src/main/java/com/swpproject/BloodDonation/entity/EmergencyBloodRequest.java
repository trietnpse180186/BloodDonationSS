package com.swpproject.BloodDonation.entity;

import com.swpproject.BloodDonation.enums.BloodType;
import com.swpproject.BloodDonation.enums.EmergencyStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity lưu trữ thông tin yêu cầu hiến máu khẩn cấp
 */
@Entity
@Table(name = "emergency_blood_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyBloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String requestId;

    @Column(nullable = false, columnDefinition = "NVARCHAR(200)")
    private String hospitalName;

    @Column(columnDefinition = "NVARCHAR(4000)")
    private String address;

    @Column(columnDefinition = "NVARCHAR(500)")
    private String contactPerson;

    private String contactPhone;

    @Column(columnDefinition = "NVARCHAR(4000)")
    private String description;

    @Enumerated(EnumType.STRING)
    private BloodType bloodTypeNeeded;

    private Integer unitsNeeded; // Số lượng đơn vị máu cần

    private LocalDateTime requestTime;

    private LocalDateTime expirationTime; // Thời hạn của yêu cầu khẩn cấp

    @Enumerated(EnumType.STRING)
    private EmergencyStatus status = EmergencyStatus.ACTIVE;

    @Column(name = "is_rare_blood_type")
    private boolean isRareBloodType = false; // Đánh dấu nếu là nhóm máu hiếm

    private String priority = "NORMAL"; // NORMAL, HIGH, CRITICAL

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy; // Người tạo yêu cầu (Staff/Admin)

    @OneToMany(mappedBy = "emergencyRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EmergencyDonation> donations = new ArrayList<>();

    // Địa điểm yêu cầu (nếu có thông tin)
    private Double latitude;
    private Double longitude;

    // Trường theo dõi cập nhật
    private LocalDateTime lastUpdatedTime;
    private String lastUpdatedBy;
}