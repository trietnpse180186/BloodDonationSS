package com.swpproject.BloodDonation.dto.request;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class NotificationRequest{
    private String title;
    private String detail;
    private LocalDate date;
    private LocalTime time;
    private String donorId;
}
