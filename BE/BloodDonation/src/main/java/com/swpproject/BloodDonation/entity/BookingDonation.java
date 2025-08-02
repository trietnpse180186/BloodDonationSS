package com.swpproject.BloodDonation.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.swpproject.BloodDonation.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "BookingDonation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDonation {

    @Id
    private String donationId;

    @Column(name = "DateDonation")
    private LocalDate dateDonation;

    @Column(name = "StartTime")
    private LocalTime startTime;

    @Column(name = "EndTime")
    private LocalTime endTime;

    @Column(name = "Address", columnDefinition = "NVARCHAR(4000)")
    private String address;

    @Column(name = "Center", columnDefinition = "NVARCHAR(4000)")
    private String center;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", columnDefinition = "NVARCHAR(255)")
    private Status status = Status.PENDING;

    @Column(name = "BookingTime")
    private LocalDateTime bookingTime; // lưu lại thời gian đặt lịch

    @ManyToOne
    @JoinColumn(name = "ScheduleId")
    @JsonBackReference
    private ScheduleDonation scheduleDonation;

    @ManyToOne
    @JoinColumn(name = "DonorId")
    private User donor;
    @Column(name = "check_in_code")
    private String checkInCode;

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
}