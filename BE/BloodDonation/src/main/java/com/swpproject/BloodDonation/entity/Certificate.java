package com.swpproject.BloodDonation.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity

public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDate donationDate;

    private int volume = 350;

    private String bookingId;
}

