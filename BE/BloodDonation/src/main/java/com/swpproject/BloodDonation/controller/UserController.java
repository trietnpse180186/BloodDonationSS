package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.UserCreationRequest;
import com.swpproject.BloodDonation.dto.request.UserUpdateRequest;
import com.swpproject.BloodDonation.dto.request.VerifyOtpRequest;
import com.swpproject.BloodDonation.dto.response.UserCreationResponse;
import com.swpproject.BloodDonation.dto.response.UserDetailResponse;
import com.swpproject.BloodDonation.dto.response.UserUpdateResponse;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.repository.UserRepository;
import com.swpproject.BloodDonation.service.MailService;
import com.swpproject.BloodDonation.service.OtpService;
import com.swpproject.BloodDonation.service.UserService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final OtpService otpService;
    private final MailService mailService;
    private final UserRepository userRepository;

    @PostMapping("/api/v1/users")
    public UserCreationResponse createUser(@RequestBody UserCreationRequest request) {
        return userService.createUser(request);
    }

    @GetMapping("/users/{id}")
    public UserDetailResponse getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    @PutMapping("/users/{id}")
    public UserUpdateResponse updateById(@PathVariable String id, @RequestBody UserUpdateRequest request){
        return userService.updateUser(id, request);
    }

    @GetMapping("/users")
    public List<UserDetailResponse> getAllUsers(){
        return userService.getAllUsers();
    }

    @DeleteMapping("/users/delete/{id}")
    public void deleteAccount(@PathVariable String id){
        userService.deleteUserWithCascade(id);
    }

    @PostMapping("/api/user/avatar")
    public ResponseEntity<String> updateUserAvatar(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {

        String imageUrl = request.get("imageUrl");

        userService.updateAvatarUrl(id, imageUrl);

        return ResponseEntity.ok("Avatar URL updated successfully.");
    }

    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestBody VerifyOtpRequest request) {
        boolean isValid = otpService.validateOtp(request.getEmail(), request.getOtpCode());
        if (!isValid) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsVerified(true);
        userRepository.save(user);

        // Send welcome email AFTER successful verification
        try {
            String subject = "Welcome to BloodDonation - Registration Successful";
            String content = String.format(
                    "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; " +
                            "border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;'>"
                            + "<h2 style='color: #c0392b;'>Welcome, %s!</h2>"
                            + "<p>Your account has been successfully verified.</p>"
                            + "<p>You can now log in and start using the platform to help save lives through blood donation.</p>"
                            + "<p>Thank you for being a part of this life-saving mission.</p>"
                            + "<br/>"
                            + "<p style='font-size: 14px; color: #7f8c8d;'>With gratitude,<br/>The BloodDonation Team</p>"
                            + "</div>",
                    user.getFullName()
            );

            mailService.sendEmail(subject, content, user.getEmail());
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to send welcome email after verification: {}", e.getMessage());
            // Continue even if email sending fails
        }

        return ResponseEntity.ok("Email verified successfully! Please check your inbox for a welcome message.");
    }

}
