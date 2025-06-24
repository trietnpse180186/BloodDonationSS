package com.swpproject.BloodDonation.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Survey")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Survey {

    @Id
    private String surveyId;

    @Column(name = "Description", columnDefinition = "NVARCHAR(255)")
    private String description;

    @Column(name = "AnswerAudit")
    private String answerAudit;

    @ManyToOne
    @JoinColumn(name = "DonationId")
    @JsonBackReference
    private BookingDonation bookingDonation;
}