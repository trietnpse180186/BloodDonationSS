package com.swpproject.BloodDonation.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
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

    @Column(name = "Address", columnDefinition = "NVARCHAR(255)")
    private String address;

    @ManyToOne
    @JoinColumn(name = "ScheduleId")
    @JsonBackReference
    private ScheduleDonation scheduleDonation;

    @ManyToOne
    @JoinColumn(name = "DonorId")
    private User donor;
}