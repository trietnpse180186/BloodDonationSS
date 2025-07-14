package com.swpproject.BloodDonation.dto.request;

import com.swpproject.BloodDonation.enums.BloodType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffCreationRequest {
    private String email;
    private String fullName;
    private String password;
    private String phoneNumber;
    private String address;
    private BloodType bloodType;
    private LocalDate birthday;
    private String sex;
    private String occupation;
}