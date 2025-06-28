package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.ResetPasswordRequest;
import com.swpproject.BloodDonation.dto.response.ResetPasswordResponse;
import com.swpproject.BloodDonation.service.ResetPasswordService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class ResetPasswordController {

    private final ResetPasswordService resetPasswordService;

    @PostMapping("/forgot-password")
    public ResponseEntity<String> requestPasswordReset(@RequestParam String email) throws MessagingException, UnsupportedEncodingException {
        resetPasswordService.requestPasswordReset(email);
        return ResponseEntity.ok("OTP has been sent to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResetPasswordResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        ResetPasswordResponse response = resetPasswordService.resetPassword(request);
        return ResponseEntity.ok(response);
    }
}
