package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.request.UserCreationRequest;
import com.swpproject.BloodDonation.dto.request.UserUpdateRequest;
import com.swpproject.BloodDonation.dto.response.UserCreationResponse;
import com.swpproject.BloodDonation.dto.response.UserDetailResponse;
import com.swpproject.BloodDonation.dto.response.UserUpdateResponse;
import com.swpproject.BloodDonation.entity.Role;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.entity.UserHasRole;
import com.swpproject.BloodDonation.enums.BloodType;
import com.swpproject.BloodDonation.repository.*;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserHasRoleRepository userHasRoleRepository;
    private final NotificationRepository notificationRepository;
    private final BookingDonationRepository bookingDonationRepository;
    private final SurveyRepository surveyRepository;
    private final CertificateRepository certificateRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final MailService mailService;
    private final EmergencyDonationRepository emergencyDonationRepository;
    // Tạo người dùng mới với vai trò mặc định là DONOR
    public UserCreationResponse createUser(UserCreationRequest request) {
        log.info("🔁 Creating user with email: {}", request.getEmail());

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            log.warn("🚫 Email already exists: {}", request.getEmail());
            throw new RuntimeException("Email already exists");
        }

        if (request.getBloodType() != null && !isValidBloodType(request.getBloodType())) {
            log.warn("🚫 Invalid blood type: {}", request.getBloodType());
            throw new RuntimeException("Invalid blood type");
        }

        try {
            User user = User.builder()
                    .email(request.getEmail())
                    .fullName(request.getFullName())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .phoneNumber(request.getPhoneNumber())
                    .address(request.getAddress())
                    .bloodType(request.getBloodType())
                    .birthday(request.getBirthday())
                    .sex(request.getSex())
                    .occupation(request.getOccupation())
                    .build();

            log.debug("✅ User entity built: {}", user);

            // role logic
            Role donorRole = roleRepository.findByName("DONOR").orElseGet(() -> {
                Role newRole = Role.builder().name("DONOR").build();
                return roleRepository.save(newRole);
            });

            user.setUserHasRoles(List.of(UserHasRole.builder()
                    .role(donorRole)
                    .user(user)
                    .build()));

            userRepository.save(user);
            log.info("✅ User saved to database: {}", user.getEmail());

            mailService.sendEmail("Welcome to Blood Donation",
                    "Welcome, you have successfully registered an account",
                    user.getEmail());
            log.info("📧 Welcome email sent to {}", user.getEmail());

            return UserCreationResponse.builder()
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .phoneNumber(user.getPhoneNumber())
                    .address(user.getAddress())
                    .bloodType(user.getBloodType())
                    .birthday(user.getBirthday())
                    .sex(user.getSex())
                    .occupation(user.getOccupation())
                    .build();

        } catch (Exception e) {
            log.error("❌ Error while creating user: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create user");
        }
    }


    // Cập nhật thông tin người dùng, chỉ cho phép người dùng đã đăng nhập truy cập
    @PutMapping("/users/{id}")
    @PreAuthorize("isAuthenticated()")
    public UserUpdateResponse updateUser(String userId, UserUpdateRequest request) {
        return userRepository.findById(userId).map(user -> {
            // Validate blood type manually if provided
            if (request.getBloodType() != null && !isValidBloodType(request.getBloodType())) {
                throw new RuntimeException("Invalid blood type");
            }
            if (request.getFullName() != null) {
                user.setFullName(request.getFullName());
            }
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }

            if (request.getAddress() != null) {
                user.setAddress(request.getAddress());
            }
            if (request.getPhoneNumber() != null) {
                user.setPhoneNumber(request.getPhoneNumber());
            }
            if (request.getBloodType() != null) {
                user.setBloodType(request.getBloodType());
            }
            if (request.getBirthday() != null) {
                user.setBirthday(request.getBirthday());
            }
            if (request.getSex() != null) {
                user.setSex(request.getSex());
            }
            if (request.getOccupation() != null) {
                user.setOccupation(request.getOccupation());
            }

            if (request.getAvatarUrl() != null) {
                user.setAvatarUrl(request.getAvatarUrl());
            }
            User updatedUser = userRepository.save(user);

            return UserUpdateResponse.builder()
                    .fullName(updatedUser.getFullName())
                    .phoneNumber(updatedUser.getPhoneNumber())
                    .address(updatedUser.getAddress())
                    .birthday(updatedUser.getBirthday())
                    .bloodType(updatedUser.getBloodType())
                    .sex(updatedUser.getSex())
                    .avatarUrl(updatedUser.getAvatarUrl())
                    .occupation(updatedUser.getOccupation())
                    .build();
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // kiểm tra xem loại máu có hợp lệ hay không
    private boolean isValidBloodType(BloodType bloodType) {
        return Arrays.asList(BloodType.values()).contains(bloodType);
    }

    // lấy thông tin chi tiết của người dùng theo ID, chỉ cho phép người dùng đã đăng nhập truy cập
    @PreAuthorize("isAuthenticated()")
    public UserDetailResponse getUserById( String userID) {
        return userRepository.findById(userID)
                .map(user -> UserDetailResponse.builder()
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .phoneNumber(user.getPhoneNumber())
                        .address(user.getAddress())
                        .bloodType(user.getBloodType())
                        .birthday(user.getBirthday())
                        .sex(user.getSex())
                        .avatarUrl(user.getAvatarUrl())
                        .occupation(user.getOccupation())
                        .build())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // lấy danh sách tất cả người dùng, chỉ cho phép ADMIN truy cập
    @PreAuthorize("hasAuthority('STAFF')") // => ROLE_USER, ROLE_USER
    public List<UserDetailResponse> getAllUsers(){
        return userRepository.findAll()
                .stream()
                .map(user -> UserDetailResponse.builder()
                        .userId(user.getUserID())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .phoneNumber(user.getPhoneNumber())
                        .address(user.getAddress())
                        .bloodType(user.getBloodType())
                        .birthday(user.getBirthday())
                        .sex(user.getSex())
                        .occupation(user.getOccupation())
                        .build())
                .toList();
    }

    @Transactional
    public void deleteUserWithCascade(String userId) {
        try {
            // 1. Lấy tất cả donation IDs của user
            List<String> donationIds = bookingDonationRepository.findDonationIdsByDonorUserId(userId);

            // 2. Xóa tất cả surveys liên quan đến các donations này
            for (String donationId : donationIds) {
                surveyRepository.deleteByDonationId(donationId);
            }
            certificateRepository.deleteByUserId(userId);   
            // 3. Xóa notifications
            notificationRepository.deleteByDonorId(userId);

            // 4. Xóa booking donations
            bookingDonationRepository.deleteByDonorId(userId);

            // 5. Xóa emergency donation
            emergencyDonationRepository.deleteByDonorId(userId);

            // 6. Xóa user
            userRepository.deleteById(userId);

        } catch (Exception e) {
            throw new RuntimeException("Error deleting user: " + e.getMessage(), e);
        }
    }

    @Transactional
    @PreAuthorize("isAuthenticated()")
    public void updateAvatarUrl(String userId, String imageUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAvatarUrl(imageUrl);
        userRepository.save(user);
    }


}

