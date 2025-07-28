package com.swpproject.BloodDonation.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.swpproject.BloodDonation.enums.NotificationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String title;

    @Column(nullable = false, columnDefinition = "NVARCHAR(4000)")
    private String detail;

    private LocalDate date;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime time;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private User donor;

    @Enumerated(EnumType.STRING)
    private NotificationStatus status = NotificationStatus.UNREAD;
}