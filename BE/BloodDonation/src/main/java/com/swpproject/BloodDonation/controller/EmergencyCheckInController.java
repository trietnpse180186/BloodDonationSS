package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.CheckInRequestDTO;
import com.swpproject.BloodDonation.dto.request.CheckOutRequestDTO;
import com.swpproject.BloodDonation.dto.response.EmergencyDonorDTO;
import com.swpproject.BloodDonation.service.EmergencyBloodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emergency/checkin")
@RequiredArgsConstructor
public class EmergencyCheckInController {

    private final EmergencyBloodService emergencyBloodService;

    /**
     * API to get emergency donation by check-in code
     */
    @GetMapping("/code/{checkInCode}")
    public ResponseEntity<EmergencyDonorDTO> getEmergencyDonationByCheckInCode(
            @PathVariable String checkInCode) {

        EmergencyDonorDTO donation = emergencyBloodService.getEmergencyDonationByCheckInCode(checkInCode);

        return ResponseEntity.ok(donation);
    }

    /**
     * API for staff to check-in a donor using code
     */
    @PostMapping
    public ResponseEntity<EmergencyDonorDTO> checkInDonorByCode(
            @Valid @RequestBody CheckInRequestDTO request,
            Authentication authentication) {

        String staffId = authentication.getName();
        EmergencyDonorDTO donation = emergencyBloodService.checkInDonorByCode(
                request.getCheckInCode(), staffId);

        return ResponseEntity.ok(donation);
    }

    /**
     * API for staff to check-out a donor
     */
    @PostMapping("/checkout/{donationId}")
    public ResponseEntity<EmergencyDonorDTO> checkOutDonor(
            @PathVariable String donationId,
            @RequestBody CheckOutRequestDTO request,
            Authentication authentication) {

        String staffId = authentication.getName();
        EmergencyDonorDTO donation = emergencyBloodService.checkOutDonor(
                donationId, request, staffId);

        return ResponseEntity.ok(donation);
    }

    /**
     * API for staff to mark a donor as no-show
     */
    @PostMapping("/noshow/{donationId}")
    public ResponseEntity<EmergencyDonorDTO> markAsNoShow(
            @PathVariable String donationId,
            Authentication authentication) {

        String staffId = authentication.getName();
        EmergencyDonorDTO donation = emergencyBloodService.markAsNoShow(donationId, staffId);

        return ResponseEntity.ok(donation);
    }
}