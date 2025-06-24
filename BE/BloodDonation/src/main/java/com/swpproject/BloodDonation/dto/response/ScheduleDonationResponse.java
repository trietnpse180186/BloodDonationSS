package com.swpproject.BloodDonation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for frontend schedule donation format
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDonationResponse {
    private String scheduleId;
    private String center;
    private String location;
    private String date;
    private List<TimeSlotDto> timeSlots;
    private Integer donorCount;
    private String updateBy;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimeSlotDto {
        private Long id;
        private String startTime;
        private String endTime;
    }
}