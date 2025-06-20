package com.swpproject.BloodDonation.dto.response;

import com.swpproject.BloodDonation.enums.BloodType;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateResponse {
    private String fullName;
    private String password;
    private String phoneNumber;
    private String address;
    private BloodType bloodType;
    private LocalDate birthday;
    private String sex;
    private String occupation;
}
