package com.swpproject.BloodDonation.dto.response;

import com.swpproject.BloodDonation.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    private String center;
    private String address;
    private String status;
    private String message;
    private User user;
    private LocalDateTime bookingTime;
    private String formattedBookingTime; // thoi gian dat lich duoc định dạng
    private String checkInCode;
    private LocalDateTime checkInTime;
    private String checkInBy;
    private LocalDateTime checkOutTime;
    private String checkOutBy;
    private String checkOutNotes;
}