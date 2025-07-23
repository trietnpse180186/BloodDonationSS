package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.request.StaffCreationRequest;
import com.swpproject.BloodDonation.dto.request.StaffUpdateRequest;
import com.swpproject.BloodDonation.dto.response.DashboardStatsResponse;
import com.swpproject.BloodDonation.dto.response.StaffResponse;
import com.swpproject.BloodDonation.entity.Role;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.entity.UserHasRole;
import com.swpproject.BloodDonation.enums.Status;
import com.swpproject.BloodDonation.repository.*;
import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final UserHasRoleRepository userHasRoleRepository;
    private final RoleRepository roleRepository;
    private final BookingDonationRepository bookingDonationRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final NotificationRepository  notificationRepository;
    private final SurveyRepository surveyRepository;
    // Lượng máu tiêu chuẩn cho mỗi lần hiến (tính bằng lít)
    private static final double STANDARD_DONATION_VOLUME = 0.35;

    @PreAuthorize("hasAuthority('ADMIN')")
    @Transactional
    public StaffResponse createStaff(StaffCreationRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại trong hệ thống");
        }

        String occupation = request.getOccupation();
        if( occupation == null && occupation.trim().isEmpty()) {
            occupation = "System Staff";
        }

        // Tạo người dùng mới với vai trò STAFF
        User staff = User.builder()
                .userID(UUID.randomUUID().toString())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .bloodType(request.getBloodType())
                .birthday(request.getBirthday())
                .sex(request.getSex())
                .occupation(occupation)
                .active(true)
                .build();

        // Đảm bảo vai trò STAFF tồn tại
        Role staffRole = roleRepository.findByName("STAFF").orElseGet(() -> {
            Role newRole = Role.builder().name("STAFF").build();
            return roleRepository.save(newRole);
        });

        // Gán vai trò STAFF cho người dùng
        staff.setUserHasRoles(List.of(UserHasRole.builder()
                .role(staffRole)
                .user(staff)
                .build()));

        User savedStaff = userRepository.save(staff);

        try {
            mailService.sendEmail(
                    "Tài khoản nhân viên tại Hệ thống hiến máu",
                    "Chào " + staff.getFullName() + ",\n\n" +
                            "Tài khoản nhân viên của bạn đã được tạo trong hệ thống quản lý hiến máu.\n" +
                            "Email đăng nhập: " + staff.getEmail() + "\n" +
                            "Mật khẩu ban đầu: " + request.getPassword() + "\n\n" +
                            "Vui lòng đổi mật khẩu sau khi đăng nhập lần đầu.\n\n" +
                            "Trân trọng,\nQuản trị viên Hệ thống hiến máu",
                    staff.getEmail());
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Gửi email thất bại cho địa chỉ: {}", staff.getEmail(), e);
        }

        return convertToStaffResponse(savedStaff);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @Transactional
    public StaffResponse updateStaff(String staffId, StaffUpdateRequest request) {
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + staffId));

        // Kiểm tra xem người dùng có vai trò STAFF không
        boolean isStaff = staff.getUserHasRoles().stream()
                .anyMatch(userHasRole -> userHasRole.getRole().getName().equals("STAFF"));

        if (!isStaff) {
            throw new RuntimeException("Người dùng không phải là nhân viên");
        }

        if (request.getFullName() != null) {
            staff.setFullName(request.getFullName());
        }
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            staff.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getPhoneNumber() != null) {
            staff.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            staff.setAddress(request.getAddress());
        }
        if (request.getBloodType() != null) {
            staff.setBloodType(request.getBloodType());
        }
        if (request.getBirthday() != null) {
            staff.setBirthday(request.getBirthday());
        }
        if (request.getSex() != null) {
            staff.setSex(request.getSex());
        }
        if (request.getOccupation() != null) {
            staff.setOccupation(request.getOccupation());
        }
        if (request.getActive() != null) {
            staff.setActive(request.getActive());
        }

        User updatedStaff = userRepository.save(staff);
        return convertToStaffResponse(updatedStaff);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public List<StaffResponse> getAllStaff() {
        // Tìm vai trò STAFF
        Role staffRole = roleRepository.findByName("STAFF")
                .orElseThrow(() -> new RuntimeException("Vai trò STAFF không tồn tại"));

        // Tìm tất cả người dùng có vai trò STAFF
        List<User> staffUsers = userRepository.findAll().stream()
                .filter(user -> user.getUserHasRoles().stream()
                        .anyMatch(userHasRole -> userHasRole.getRole().equals(staffRole)))
                .collect(Collectors.toList());

        return staffUsers.stream()
                .map(this::convertToStaffResponse)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public StaffResponse getStaffById(String staffId) {
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + staffId));

        // Kiểm tra xem người dùng có vai trò STAFF không
        boolean isStaff = staff.getUserHasRoles().stream()
                .anyMatch(userHasRole -> userHasRole.getRole().getName().equals("STAFF"));

        if (!isStaff) {
            throw new RuntimeException("Người dùng không phải là nhân viên");
        }

        return convertToStaffResponse(staff);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @Transactional
    public void deleteStaff(String staffId) {
        try {
            // Tìm nhân viên theo ID
            User staff = userRepository.findById(staffId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với ID: " + staffId));

            // Kiểm tra xem người dùng có vai trò STAFF không
            boolean isStaff = staff.getUserHasRoles().stream()
                    .anyMatch(userHasRole -> userHasRole.getRole().getName().equals("STAFF"));

            if (!isStaff) {
                throw new RuntimeException("Người dùng không phải là nhân viên");
            }
            notificationRepository.deleteByUserId(staffId);
            List<String> donationIds = bookingDonationRepository.findDonationIdsByDonorUserId(staffId);

            if (!donationIds.isEmpty()) {
                bookingDonationRepository.deleteSurveysByDonationIds(donationIds);
            }
            bookingDonationRepository.deleteByDonorId(staffId);

            // Lấy tất cả vai trò của nhân viên
            List<UserHasRole> userHasRoles = userHasRoleRepository.findByUser(staff);

            // Xóa tất cả vai trò của nhân viên
            if (userHasRoles != null && !userHasRoles.isEmpty()) {
                userHasRoleRepository.deleteAll(userHasRoles);
            }
            // Xóa nhân viên khỏi hệ thống
            userRepository.delete(staff);
            log.info("Đã xóa nhân viên với ID: {}", staffId);
        } catch (Exception e) {
            log.error("Lỗi khi xóa nhân viên với ID: {}", staffId, e.getMessage(), e);
            throw new RuntimeException("Không thể xóa nhân viên: " + e.getMessage(), e);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public DashboardStatsResponse getDashboardStats() {
        // Đếm tổng số người dùng có vai trò DONOR
        Role donorRole = roleRepository.findByName("DONOR")
                .orElseThrow(() -> new RuntimeException("Vai trò DONOR không tồn tại"));

        long totalDonors = userRepository.findAll().stream()
                .filter(user -> user.getUserHasRoles().stream()
                        .anyMatch(userHasRole -> userHasRole.getRole().equals(donorRole)))
                .count();

        // Đếm tổng số nhân viên (người dùng có vai trò STAFF)
        Role staffRole = roleRepository.findByName("STAFF")
                .orElseThrow(() -> new RuntimeException("Vai trò STAFF không tồn tại"));

        long totalStaff = userRepository.findAll().stream()
                .filter(user -> user.getUserHasRoles().stream()
                        .anyMatch(userHasRole -> userHasRole.getRole().equals(staffRole)))
                .count();

        // Đếm tổng số lượt hiến máu đã hoàn thành
        long totalCompletedDonations = bookingDonationRepository.findAll().stream()
                .filter(booking -> booking.getStatus() == Status.COMPLETED)
                .count();

        // Tính tổng lượng máu đã nhận
        double totalBloodVolume = totalCompletedDonations * STANDARD_DONATION_VOLUME;

        // Đếm số lượt hiến máu đang chờ xử lý
        long pendingDonations = bookingDonationRepository.findAll().stream()
                .filter(booking -> booking.getStatus() == Status.PENDING)
                .count();

        // Đếm số lượt hiến máu đã hủy
        long canceledDonations = bookingDonationRepository.findAll().stream()
                .filter(booking -> booking.getStatus() == Status.CANCELLED)
                .count();

        return DashboardStatsResponse.builder()
                .totalDonors(totalDonors)
                .totalStaff(totalStaff)
                .totalDonations(totalCompletedDonations)
                .totalBloodVolume(totalBloodVolume)
                .pendingDonations(pendingDonations)
                .canceledDonations(canceledDonations)
                .build();
    }

    private StaffResponse convertToStaffResponse(User staff) {
        return StaffResponse.builder()
                .userId(staff.getUserID())
                .email(staff.getEmail())
                .fullName(staff.getFullName())
                .phoneNumber(staff.getPhoneNumber())
                .address(staff.getAddress())
                .bloodType(staff.getBloodType())
                .birthday(staff.getBirthday())
                .sex(staff.getSex())
                .occupation(staff.getOccupation())
                .active(staff.isActive())
                .build();
    }
}