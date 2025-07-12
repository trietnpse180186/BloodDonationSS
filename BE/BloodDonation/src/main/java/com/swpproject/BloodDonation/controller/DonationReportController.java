package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.response.UserDonationReportResponse;
import com.swpproject.BloodDonation.service.DonationReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DonationReportController {

    private final DonationReportService donationReportService;

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('STAFF') or #userId == authentication.principal.username")
    public ResponseEntity<UserDonationReportResponse> getUserDonationReport(@PathVariable String userId) {
        UserDonationReportResponse report = donationReportService.generateUserDonationReport(userId);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/user/{userId}/eligibility")
    public ResponseEntity<Boolean> checkUserDonationEligibility(@PathVariable String userId) {
        boolean canDonate = donationReportService.canUserDonate(userId);
        return ResponseEntity.ok(canDonate);
    }
}