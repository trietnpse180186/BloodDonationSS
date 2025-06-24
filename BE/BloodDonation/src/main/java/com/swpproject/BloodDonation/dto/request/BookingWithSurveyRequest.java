package com.swpproject.BloodDonation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingWithSurveyRequest {
    private BookingRequest booking;
    private List<SurveyRequest> survey;
}
