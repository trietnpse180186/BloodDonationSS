package com.swpproject.BloodDonation.dto.request;

import com.swpproject.BloodDonation.enums.BloodType;
import lombok.Data;

import java.time.LocalDate;

/**
 * DTO for updating user information. All fields are optional to allow partial updates.
 * Email and role are not included as they are immutable or managed separately.
 */
@Data
public class UserUpdateRequest {
    private String fullName;
    private String password;
    private String phoneNumber;
    private String address;
    private BloodType bloodType;
    private LocalDate birthday;
    private String sex;
    private String occupation;
}