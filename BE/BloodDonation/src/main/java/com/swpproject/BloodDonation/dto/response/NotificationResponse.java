package com.swpproject.BloodDonation.dto.response;

import com.swpproject.BloodDonation.enums.NotificationStatus;
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
public class NotificationResponse {
    private String id;
    private String title;
    private String detail;
    private LocalDate date;
    private LocalTime time;
    private String actionUrl;
    private String donorId;
    private String donorName;
    private NotificationStatus status;
}