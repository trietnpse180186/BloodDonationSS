package com.swpproject.BloodDonation.dto.request;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateCreationRequest {
    private String donorEmail;
    private String donorName;
    private LocalDate donationDate;
    private String bloodType;
    private int donationCount;
}
