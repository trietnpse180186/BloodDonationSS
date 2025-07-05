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
<<<<<<< Updated upstream
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
=======
    private String location; // =address
    private String date; // yyyy-MM-dd
    private List<TimeSlotResponse> timeSlots;
    private Integer donorCount; // nhan gia tri tu numberOfDonor trong entity
    private String updateBy; // ten dang nhap cua nguoi cap nhat cuoi cung
    private Integer currentDonorCount; // so luong nguoi da dang ky hien tai
    private String registrationStatus; // thong tin dang ky (VD: "15/30 dang ky")
>>>>>>> Stashed changes
}