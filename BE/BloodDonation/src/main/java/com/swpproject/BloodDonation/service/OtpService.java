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

    //gủi mã OTP đến email
    public void sendOtp(String email) throws MessagingException, UnsupportedEncodingException {
        // Generate OTP and expiration time
        String otpCode = generateOtpCode();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusMinutes(otpExpirationMinutes);

        // Save OTP token to database
        OtpToken otpToken = OtpToken.builder()
                .email(email)
                .otpCode(otpCode)
                .createdAt(now)
                .expiresAt(expiresAt)
                .used(false)
                .build();
        otpTokenRepository.save(otpToken);

        // Email subject and HTML content
        String subject = "Password Reset OTP - Blood Donation";
        String content = String.format(
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; " +
                        "border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;'>"
                        + "<h2 style='color: #c0392b;'>Password Reset Request</h2>"
                        + "<p>We received a request to reset the password associated with this email address.</p>"
                        + "<p>Please use the following One-Time Password (OTP) to proceed:</p>"
                        + "<div style='font-size: 26px; font-weight: bold; color: #e74c3c; margin: 20px 0; text-align: center;'>%s</div>"
                        + "<p>This code is valid for <strong>%d minutes</strong>.</p>"
                        + "<p>If you did not request a password reset, please ignore this message.</p>"
                        + "<br/>"
                        + "<p style='font-size: 14px; color: #95a5a6;'>Stay safe,<br/>The BloodDonation Team</p>"
                        + "</div>",
                otpCode, otpExpirationMinutes
        );

        // Send the email
        mailService.sendEmail(subject, content, email);
    }


    // Gửi mã OTP để xác minh email
    public void sendOtpForVerify(String email) throws MessagingException, UnsupportedEncodingException {
        // Generate OTP and set expiration
        String otpCode = generateOtpCode();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusMinutes(otpExpirationMinutes);

        // Save OTP to database
        OtpToken otpToken = OtpToken.builder()
                .email(email)
                .otpCode(otpCode)
                .createdAt(now)
                .expiresAt(expiresAt)
                .used(false)
                .build();
        otpTokenRepository.save(otpToken);

        // Email subject and content
        String subject = "Email Verification - Blood Donation";
        String content = String.format(
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; " +
                        "border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;'>"
                        + "<h2 style='color: #c0392b; text-align: center;'>Email Verification Code</h2>"
                        + "<p>Dear volunteer,</p>"
                        + "<p>Thank you for joining our blood donation platform. To complete your registration, please enter the One-Time Password (OTP) below:</p>"
                        + "<div style='font-size: 28px; font-weight: bold; color: #e74c3c; margin: 24px 0; text-align: center;'>%s</div>"
                        + "<p style='text-align: center;'>This code is valid for <strong>%d minutes</strong>.</p>"
                        + "<p style='color: #7f8c8d;'>Please do not share this code with anyone. If you did not request this, simply ignore this message.</p>"
                        + "<br/>"
                        + "<hr style='border: none; border-top: 1px solid #eee;'/>"
                        + "<p style='font-size: 14px; color: #95a5a6;'>Together, we save lives.<br/>"
                        + "— Blood Donation Team</p>"
                        + "</div>",
                otpCode, otpExpirationMinutes
        );

        // Send email
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
