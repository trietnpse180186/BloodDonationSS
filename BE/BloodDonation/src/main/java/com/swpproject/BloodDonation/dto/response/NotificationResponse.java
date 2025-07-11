package com.swpproject.BloodDonation.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
@Builder
public class NotificationResponse {
    private String id;
    private String title;
    private String detail;
    private LocalDate date;
    private LocalTime time;
    private String status;
    private String donorId;
    private String donorName;
}
