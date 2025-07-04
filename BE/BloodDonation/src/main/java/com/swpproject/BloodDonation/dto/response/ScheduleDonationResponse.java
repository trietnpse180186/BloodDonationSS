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
    private String location; // =address
    private String date; // yyyy-MM-dd
    private List<TimeSlotResponse> timeSlots;
    private Integer donorCount; // nhan gia tri tu numberOfDonor trong entity
    private String updateBy; // ten dang nhap cua nguoi cap nhat cuoi cung
}