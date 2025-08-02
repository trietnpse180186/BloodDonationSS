package com.swpproject.BloodDonation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckOutRequestDTO {
    private String notes; // Ghi chú khi check-out
}