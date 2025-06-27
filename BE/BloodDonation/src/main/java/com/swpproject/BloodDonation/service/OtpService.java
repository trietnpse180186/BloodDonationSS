package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.entity.OtpToken;
import com.swpproject.BloodDonation.exception.AuthenticationException;
import com.swpproject.BloodDonation.repository.OtpTokenRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {
    private final OtpTokenRepository otpTokenRepository;
    private final MailService mailService;

    @Value("${otp.expiration.minutes:5}")
    private int otpExpirationMinutes;

    private String generateOtpCode() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // Ensures a 6-digit number
        return String.valueOf(otp);
    }

    public void sendOtp(String email) throws MessagingException, UnsupportedEncodingException {
        String otpCode = generateOtpCode();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusMinutes(otpExpirationMinutes);

        OtpToken otpToken = OtpToken.builder()
                .email(email)
                .otpCode(otpCode)
                .createdAt(now)
                .expiresAt(expiresAt)
                .used(false) // Đảm bảo giá trị được đặt rõ ràng
                .build();
        otpTokenRepository.save(otpToken);

        String subject = "Your OTP Code";
        String content = String.format(
                "<h2>Your OTP for Password Reset</h2>" +
                        "<p>Your OTP is: <strong>%s</strong></p>" +
                        "<p>This OTP is valid for %d minutes.</p>",
                otpCode, otpExpirationMinutes);
        mailService.sendEmail(subject, content, email);
    }

    public boolean validateOtp(String email, String otpCode) {
        OtpToken otpToken = otpTokenRepository.findById(email)
                .orElseThrow(() -> new AuthenticationException("No OTP found for this email."));
        LocalDateTime now = LocalDateTime.now();
        if (otpToken.isUsed() || now.isAfter(otpToken.getExpiresAt()) || !otpToken.getOtpCode().equals(otpCode)) {
            throw new AuthenticationException("Invalid or expired OTP.");
        }
        // Mark the OTP as used
        otpToken.setUsed(true);
        otpTokenRepository.save(otpToken);
        return true; // OTP is valid
    }
}
