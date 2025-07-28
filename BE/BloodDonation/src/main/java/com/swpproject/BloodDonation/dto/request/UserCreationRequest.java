package com.swpproject.BloodDonation.dto.request;

import com.swpproject.BloodDonation.entity.Role;
import com.swpproject.BloodDonation.enums.BloodType;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
public class UserCreationRequest {
    @NotBlank(message = "Full name cannot be empty")
    @Size(min = 3, max = 50, message = "Full name must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-ZÀ-ỹ\\s]+$", message = "Full name must contain only letters and spaces")
    private String fullName;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Email must be in valid format")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character")
    private String password;

    @NotBlank(message = "Phone number cannot be empty")
    @Pattern(regexp = "^(0[3|5|7|8|9])+([0-9]{8})$",
            message = "Phone number must be a valid Vietnamese phone number")
    private String phoneNumber;

    @Size(max = 200, message = "Address cannot exceed 200 characters")
    private String address;

    private Role role;

    @Nullable
    private BloodType bloodType;

    @Past(message = "Birthday must be a date in the past")
    @NotNull(message = "Birthday cannot be empty")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;

    @NotBlank(message = "Gender cannot be empty")
    @Pattern(regexp = "^(Male|Female|Other)$", message = "Gender must be Male, Female, or Other")
    private String sex;

    @Size(max = 100, message = "Occupation cannot exceed 100 characters")
    private String occupation;
}