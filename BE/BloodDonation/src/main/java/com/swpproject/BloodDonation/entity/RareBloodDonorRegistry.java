package com.swpproject.BloodDonation.entity;

import com.swpproject.BloodDonation.enums.BloodType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Entity quản lý thông tin người hiến máu hiếm
 */
@Entity
@Table(name = "rare_blood_donor_registry")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RareBloodDonorRegistry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private User donor;

    @Enumerated(EnumType.STRING)
    private BloodType bloodType;

    private String specialNotes; // Ghi chú đặc biệt

    private LocalDateTime lastDonationDate;

    private boolean isAvailableForEmergency = true;

    private String contactPreference; // "PHONE", "EMAIL", "BOTH"

    private Double homeLatitude;
    private Double homeLongitude;
    private Double workLatitude;
    private Double workLongitude;

    private String additionalContactName;
    private String additionalContactPhone;

    @Column(columnDefinition = "NVARCHAR(1000)")
    private String medicalNotes;

    private LocalDateTime registrationDate;
    private LocalDateTime lastUpdatedTime;
}