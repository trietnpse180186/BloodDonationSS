package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.BookingWithSurveyRequest;
import com.swpproject.BloodDonation.dto.response.BookingResponse;
import com.swpproject.BloodDonation.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/booking")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    // tạo lịch hẹn với khảo sát
    @PostMapping("/create")
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingWithSurveyRequest request) {
        BookingResponse response = bookingService.createBookingWithSurvey(request);
        return ResponseEntity.ok(response);
    }

    // xem lịch hẹn theo userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponse>> getUserBookingsByUserId(@PathVariable String userId) {
        List<BookingResponse> bookings = bookingService.getUserBookingsByUserId(userId);
        return ResponseEntity.ok(bookings);
    }

    // xem lịch hẹn theo id
    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable String bookingId) {
        BookingResponse booking = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(booking);
    }

    // update trạng thái của lịch hẹn
    @PutMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> updateBookingStatusById(
            @PathVariable String bookingId,
            @RequestParam String status) {

        bookingService.updateBookingStatus(bookingId, status);
        BookingResponse updatedBooking = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(updatedBooking);
    }

    // xem tất cả các lịch hẹn
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('STAFF')")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<BookingResponse> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
}