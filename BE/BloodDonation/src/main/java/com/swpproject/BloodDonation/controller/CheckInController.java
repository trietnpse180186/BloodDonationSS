package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.CheckInRequestDTO;
import com.swpproject.BloodDonation.dto.request.CheckOutRequestDTO;
import com.swpproject.BloodDonation.dto.response.BookingResponse;
import com.swpproject.BloodDonation.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkin")
@RequiredArgsConstructor
public class CheckInController {

    private final BookingService bookingService;

    /**
     * API to get booking by check-in code
     */
    @GetMapping("/code/{checkInCode}")
    public ResponseEntity<BookingResponse> getBookingByCheckInCode(
            @PathVariable String checkInCode) {


        BookingResponse response = bookingService.getBookingByCheckInCode(checkInCode);

        return ResponseEntity.ok(response);
    }

    /**
     * API for staff to check-in a donor using code
     */
    @PostMapping
    public ResponseEntity<BookingResponse> checkInDonorByCode(
            @Valid @RequestBody CheckInRequestDTO request,
            Authentication authentication) {

        String staffId = authentication.getName();
        BookingResponse response = bookingService.checkInDonorByCode(request.getCheckInCode(), staffId);

        return ResponseEntity.ok(response);
    }

    /**
     * API for staff to check-out a donor
     */
    @PostMapping("/checkout/{bookingId}")
    public ResponseEntity<BookingResponse> checkOutDonor(
            @PathVariable String bookingId,
            @RequestBody CheckOutRequestDTO request,
            Authentication authentication) {

        String staffId = authentication.getName();
        BookingResponse response = bookingService.checkOutDonor(bookingId, request, staffId);

        return ResponseEntity.ok(response);
    }

    /**
     * API for staff to mark a donor as no-show
     */
    @PostMapping("/noshow/{bookingId}")
    public ResponseEntity<BookingResponse> markAsNoShow(
            @PathVariable String bookingId,
            Authentication authentication) {

        String staffId = authentication.getName();
        BookingResponse response = bookingService.markAsNoShow(bookingId, staffId);

        return ResponseEntity.ok(response);
    }

    /**
     * API for staff to approve a booking and generate check-in code
     */
    @PostMapping("/approve/{bookingId}")
    public ResponseEntity<BookingResponse> approveBooking(
            @PathVariable String bookingId,
            Authentication authentication) {

        String staffId = authentication.getName();
        BookingResponse response = bookingService.approveBookingWithCheckInCode(bookingId, staffId);

        return ResponseEntity.ok(response);
    }
}