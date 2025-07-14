package com.swpproject.BloodDonation.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Builder
@Getter
@Setter
public class NotificationResponse {
    private String id;
    private String title;
    private String detail;
    private LocalDate date;
    private LocalTime time;
    private String status;
    private String donorId;
}
