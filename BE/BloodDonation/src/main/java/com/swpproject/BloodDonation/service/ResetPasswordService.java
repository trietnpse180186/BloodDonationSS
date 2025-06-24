package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.request.ResetPasswordRequest;
import com.swpproject.BloodDonation.dto.response.ResetPasswordResponse;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.exception.AuthenticationException;
import com.swpproject.BloodDonation.repository.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
public class ResetPasswordService {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;

    public void requestPasswordReset(String email) throws MessagingException, UnsupportedEncodingException {
        // Kiểm tra email có tồn tại trong hệ thống không
        userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("Email not found."));
        // Gửi OTP nếu email tồn tại
        otpService.sendOtp(email);
    }

    public ResetPasswordResponse resetPassword(ResetPasswordRequest request) {
        // Kiểm tra OTP hợp lệ
        otpService.validateOtp(request.getEmail(), request.getOtpCode());

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp không
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AuthenticationException("New password and confirm password do not match.");
        }

        // Kiểm tra các điều kiện mật khẩu (tùy chọn)
        if (request.getNewPassword().length() < 8) {
            throw new AuthenticationException("New password must be at least 8 characters long.");
        }

        // Tìm người dùng theo email và cập nhật mật khẩu
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationException("User not found."));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResetPasswordResponse.builder()
                .message("Password reset successfully.")
                .build();
    }
}
