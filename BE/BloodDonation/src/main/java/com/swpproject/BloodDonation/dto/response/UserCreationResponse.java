package com.swpproject.BloodDonation.dto.response;

import com.swpproject.BloodDonation.entity.Role;
import com.swpproject.BloodDonation.enums.BloodType;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCreationResponse {
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private Role role;
    private BloodType bloodType;
    private LocalDate birthday;
    private String sex;
    private String occupation;
}