package com.swpproject.BloodDonation.dto.request;

import com.swpproject.BloodDonation.enums.BloodType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for creating a new emergency blood donation request
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyBloodRequestDTO {

    @NotBlank(message = "Hospital name must not be empty")
    private String hospitalName;

    @NotBlank(message = "Address must not be empty")
    private String address;

    @NotBlank(message = "Contact person must not be empty")
    private String contactPerson;

    @NotBlank(message = "Contact phone must not be empty")
    private String contactPhone;

    private String description;

    @NotNull(message = "Required blood type must not be empty")
    private BloodType bloodTypeNeeded;

    @NotNull(message = "Number of blood units must not be empty")
    @Min(value = 1, message = "Minimum number of blood units is 1")
    private Integer unitsNeeded;

    private LocalDateTime expirationTime;

    private String priority;

    private Double latitude;
    private Double longitude;
}