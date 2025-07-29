package com.swpproject.BloodDonation.dto.request;

import com.swpproject.BloodDonation.enums.BloodType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BloodUsageRequestDTO {
    @NotNull(message = "Blood type must not be empty")
    private BloodType bloodType;

    @NotNull(message = "Quantity must not be empty")
    @Min(value = 1, message = "Quantity must be greater than 0")
    private Double quantity;

    private String reason;
    private String patientId;
    private String hospitalDepartment;
    private String requestedBy;
}