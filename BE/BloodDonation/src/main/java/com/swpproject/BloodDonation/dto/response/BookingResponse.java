package com.swpproject.BloodDonation.dto.response;

import com.swpproject.BloodDonation.entity.User;
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
public class BookingResponse {
    private String bookingId;
    private LocalDate dateDonation;
    private LocalTime startTime;
    private LocalTime endTime;
    private String address;
    private String message;
    private User user;
}