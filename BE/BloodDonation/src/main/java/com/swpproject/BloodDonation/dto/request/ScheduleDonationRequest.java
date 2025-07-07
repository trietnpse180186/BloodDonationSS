package com.swpproject.BloodDonation.dto.request;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDonationRequest {
    private String center;
    private String address;
    private LocalDate date; // yyyy-MM-dd
    private List<TimeSlotRequest> timeSlots;
    private Integer numberOfDonor; // maximum number of donors allowed
}
