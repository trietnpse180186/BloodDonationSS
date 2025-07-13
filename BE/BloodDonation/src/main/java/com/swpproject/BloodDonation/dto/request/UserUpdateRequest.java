package com.swpproject.BloodDonation.dto.request;

import com.swpproject.BloodDonation.enums.BloodType;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

/**
 * DTO for updating user information. All fields are optional to allow partial updates.
 * Email and role are not included as they are immutable or managed separately.
 */
@Data
public class UserUpdateRequest {
    @Size(min = 3, max = 50, message = "Full name must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-ZÀ-ỹ\\s]+$", message = "Full name must contain only letters and spaces")
    private String fullName;

    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character")
    private String password;

    @Pattern(regexp = "^(0[3|5|7|8|9])+([0-9]{8})$",
            message = "Phone number must be a valid Vietnamese phone number")
    private String phoneNumber;

    @Size(max = 200, message = "Address cannot exceed 200 characters")
    private String address;

    private BloodType bloodType;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;

    @Pattern(regexp = "^(Male|Female|Other)$", message = "Gender must be Male, Female, or Other")
    private String sex;

    @Size(max = 100, message = "Occupation cannot exceed 100 characters")
    private String occupation;
    private String avatarUrl;
}