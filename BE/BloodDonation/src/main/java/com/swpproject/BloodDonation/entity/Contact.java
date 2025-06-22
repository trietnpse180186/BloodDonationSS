package com.swpproject.BloodDonation.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "NVARCHAR(100)")
    private String fullName;

    @Column(columnDefinition = "NVARCHAR(20)")
    private String phoneNumber;

    @Column(columnDefinition = "NVARCHAR(1000)")
    private String email;

    @Column(columnDefinition = "NVARCHAR(4000)")
    private String details;

}
