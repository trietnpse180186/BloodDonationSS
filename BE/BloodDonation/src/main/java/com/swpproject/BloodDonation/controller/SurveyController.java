package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.entity.Survey;
import com.swpproject.BloodDonation.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/survey")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SurveyController {

    private final BookingService bookingService;

        @GetMapping("/{bookingId}")
        public ResponseEntity<List<Survey>> getSurveysByBookingId(@PathVariable String bookingId) {
            List<Survey> surveys = bookingService.getSurveysByBookingId(bookingId);
            return ResponseEntity.ok(surveys);
        }
}