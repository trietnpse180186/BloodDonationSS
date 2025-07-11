package com.swpproject.BloodDonation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest{
    private String title;
    private String detail;
    private LocalDate date;
    private LocalTime time;
    private String donorId;
}

