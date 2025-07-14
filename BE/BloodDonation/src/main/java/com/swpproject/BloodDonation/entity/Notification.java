package com.swpproject.BloodDonation.entity;

import com.swpproject.BloodDonation.enums.NotificationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "notification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(columnDefinition = "NVARCHAR(4000)")
    private String title;

    @Column(columnDefinition = "NVARCHAR(4000)")
    private String detail;

    private LocalDate date;
    private LocalTime time;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private NotificationStatus status = NotificationStatus.UNREAD;

    @ManyToOne
    @JoinColumn(name = "userid")
    private User donor;
}
