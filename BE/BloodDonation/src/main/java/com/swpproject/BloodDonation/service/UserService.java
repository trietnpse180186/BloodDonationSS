package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.request.UserCreationRequest;
import com.swpproject.BloodDonation.dto.request.UserUpdateRequest;
import com.swpproject.BloodDonation.dto.response.UserCreationResponse;
import com.swpproject.BloodDonation.dto.response.UserDetailResponse;
import com.swpproject.BloodDonation.dto.response.UserUpdateResponse;
import com.swpproject.BloodDonation.entity.Role;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.entity.UserHasRole;
import com.swpproject.BloodDonation.repository.RoleRepository;
import com.swpproject.BloodDonation.repository.UserRepository;
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
import com.swpproject.BloodDonation.repository.UserHasRoleRepository;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserHasRoleRepository userHasRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final MailService mailService;

    public UserCreationResponse createUser(UserCreationRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email existed");
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


    @PutMapping("/users/{id}")
    @PreAuthorize("isAuthenticated()")
    public UserUpdateResponse updateUser (@PathVariable("id") String userId,
                                                  @RequestBody UserUpdateRequest request) {
        return userRepository.findById(userId).map(user -> {
            user.setFullName(request.getFullName());
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            user.setAddress(request.getAddress());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setBloodType(request.getBloodType());
            user.setBirthday(request.getBirthday());
            user.setSex(request.getSex());
            user.setOccupation(request.getOccupation());

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


    @Transactional
    @PreAuthorize("isAuthenticated() AND hasAuthority('DONOR')")
    public void deleteAccount(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        userHasRoleRepository.deleteByUser(user);
        userRepository.delete(user);
    }

}

