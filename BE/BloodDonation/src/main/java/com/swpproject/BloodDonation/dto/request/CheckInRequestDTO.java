package com.swpproject.BloodDonation.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckInRequestDTO {
    @NotBlank(message = "Check-in code must not be empty")
    @Pattern(regexp = "^HIENMAU-\\d{3}$", message = "Invalid check-in code format (should be HIENMAU-XXX)")
    private String checkInCode; // Mã check-in
}