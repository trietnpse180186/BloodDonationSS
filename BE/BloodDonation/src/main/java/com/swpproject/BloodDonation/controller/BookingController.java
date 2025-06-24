package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.BookingWithSurveyRequest;
import com.swpproject.BloodDonation.dto.response.BookingResponse;
import com.swpproject.BloodDonation.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingWithSurveyRequest request) {
        BookingResponse response = bookingService.createBookingWithSurvey(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponse>> getUserBookingsByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable String bookingId) {
        BookingResponse booking = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(booking);
    }

}