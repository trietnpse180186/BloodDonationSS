package com.swpproject.BloodDonation.dto.request;

import com.swpproject.BloodDonation.entity.Role;
import com.swpproject.BloodDonation.enums.BloodType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserCreationRequest {
    private String fullName;
    private String email;
    private String password;
    private String phoneNumber;
    private String address;
    private Role role;
    private BloodType bloodType;
    private LocalDate birthday;
    private String sex;
    private String occupation;

}