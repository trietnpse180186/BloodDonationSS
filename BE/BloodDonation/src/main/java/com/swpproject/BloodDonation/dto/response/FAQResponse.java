package com.swpproject.BloodDonation.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FAQResponse {
    private Long id;
    private String question;
    private String answer;
}
