package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.request.UserCreationRequest;
import com.swpproject.BloodDonation.dto.response.UserCreationResponse;
import com.swpproject.BloodDonation.dto.response.UserDetailResponse;
import com.swpproject.BloodDonation.entity.Role;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.entity.UserHasRole;
import com.swpproject.BloodDonation.repository.RoleRepository;
import com.swpproject.BloodDonation.repository.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.io.UnsupportedEncodingException;
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

    public UserCreationResponse createUser(UserCreationRequest request) {
        Optional<User> byEmail = userRepository.findByEmail(request.getEmail());
        if(byEmail.isPresent()) {
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

        Optional<Role> role = roleRepository.findByName("USER");
        if(role.isEmpty()) {
            Role newRole = Role.builder()
                    .name("USER")
                    .build();
            roleRepository.save(newRole);
            user.setUserHasRoles(List.of(UserHasRole.builder()
                    .role(newRole)
                    .user(user)
                    .build()));
        }

        role.ifPresent(value -> user.setUserHasRoles(List.of(UserHasRole.builder()
                .role(value)
                .user(user)
                .build())));
        userRepository.save(user);

        try {
            mailService.sendEmail("Welcome to Blood Donation ", "Welcome, you have successfully registered an accoun ", user.getEmail());
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("SendEmail failed with email: {}",user.getEmail());
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

}

