package com.swpproject.BloodDonation.dto.response;

import lombok.*;
import java.time.LocalDate;

@Builder
@Data
@AllArgsConstructor
public class CertificateResponse {
    private String id;
    private LocalDate donationDate;
    private int volume;
}
