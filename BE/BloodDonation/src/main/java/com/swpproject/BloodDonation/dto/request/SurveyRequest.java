package com.swpproject.BloodDonation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SurveyRequest {
    private String questionId;
    private String answer;
    private String additionalInfo;
}