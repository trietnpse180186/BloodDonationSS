package com.swpproject.BloodDonation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class BookingRequest {
    private String scheduleId;
    private LocalDate date;
    private String location;
    private String center;
    private String timeSlot;
}
