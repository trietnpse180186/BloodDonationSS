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
import com.swpproject.BloodDonation.repository.RoleRepository;
import com.swpproject.BloodDonation.repository.UserRepository;
import jakarta.mail.MessagingException;
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
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final MailService mailService;

    // Tạo người dùng mới với vai trò mặc định là DONOR
    public UserCreationResponse createUser(UserCreationRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        // Validate blood type manually
        if (request.getBloodType() != null && !isValidBloodType(request.getBloodType())) {
            throw new RuntimeException("Invalid blood type");
        }

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

        // Ensure role exists or create new
        Role donorRole = roleRepository.findByName("DONOR").orElseGet(() -> {
            Role newRole = Role.builder().name("DONOR").build();
            return roleRepository.save(newRole);
        });

        // Gán role vào user
        user.setUserHasRoles(List.of(UserHasRole.builder()
                .role(donorRole)
                .user(user)
                .build()));

        userRepository.save(user);

        try {
            mailService.sendEmail("Welcome to Blood Donation",
                    "Welcome, you have successfully registered an account",
                    user.getEmail());
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("SendEmail failed with email: {}", user.getEmail());
            throw new RuntimeException(e);
        }

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

            User updatedUser = userRepository.save(user);

            return UserUpdateResponse.builder()
                    .fullName(updatedUser.getFullName())
                    .phoneNumber(updatedUser.getPhoneNumber())
                    .address(updatedUser.getAddress())
                    .birthday(updatedUser.getBirthday())
                    .bloodType(updatedUser.getBloodType())
                    .sex(updatedUser.getSex())
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
                        .occupation(user.getOccupation())
                        .build())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // lấy danh sách tất cả người dùng, chỉ cho phép ADMIN truy cập
    @PreAuthorize("hasAuthority('ADMIN')") // => ROLE_USER, ROLE_USER
    public List<UserDetailResponse> getAllUsers(){
        return userRepository.findAll()
                .stream()
                .map(user -> UserDetailResponse.builder()
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

}

