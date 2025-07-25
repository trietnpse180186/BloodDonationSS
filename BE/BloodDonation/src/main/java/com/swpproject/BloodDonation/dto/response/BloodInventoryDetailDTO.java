package com.swpproject.BloodDonation.dto.response;

import com.swpproject.BloodDonation.enums.BloodType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BloodInventoryDetailDTO {
    private String id;
    private BloodType bloodType;
    private Double quantity;
    private LocalDateTime receivedDate;
    private LocalDateTime expiryDate;
    private String source;
    private String donationId;
    private String donorId;
    private String donorName;
    private String status;
    private String notes;
    private int daysUntilExpiry;
}