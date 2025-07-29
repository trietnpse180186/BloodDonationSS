package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.BookingWithSurveyRequest;
import com.swpproject.BloodDonation.dto.request.StatusUpdateRequest;
import com.swpproject.BloodDonation.dto.response.BookingResponse;
import com.swpproject.BloodDonation.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
            @RequestBody StatusUpdateRequest request) {
        // Để tránh exception từ việc gửi mail làm đứt flow API, bọc tất cả vào try-catch
        try {
            bookingService.updateBookingStatus(bookingId, request.getStatus());
            BookingResponse updatedBooking = bookingService.getBookingById(bookingId);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            // Log lỗi và trả về status 400
            System.err.println("Error updating booking status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // xem tất cả các lịch hẹn9
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('STAFF')")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<BookingResponse> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @DeleteMapping("/{bookingId}")
    @PreAuthorize("hasAuthority('STAFF')")
    public ResponseEntity<Void> deleteBooking(@PathVariable String bookingId) {
        bookingService.deleteBooking(bookingId);
        return ResponseEntity.noContent().build();
    }

}