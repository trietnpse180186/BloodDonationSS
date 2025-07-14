package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.response.UserDonationReportResponse;
import com.swpproject.BloodDonation.entity.BookingDonation;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.enums.Status;
import com.swpproject.BloodDonation.repository.BookingDonationRepository;
import com.swpproject.BloodDonation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonationReportService {

    private final UserRepository userRepository;
    private final BookingDonationRepository bookingDonationRepository;

    // Lượng máu tiêu chuẩn cho mỗi lần hiến (tính bằng lít)
    private static final double STANDARD_DONATION_VOLUME = 0.35;

    // Số ngày tối thiểu giữa các lần hiến máu (2 tháng = 60 ngày)
    private static final long MIN_DAYS_BETWEEN_DONATIONS = 60;

    public UserDonationReportResponse generateUserDonationReport(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Can not found user with ID: " + userId));

        // Lấy tất cả các lần hiến máu đã HOÀN THÀNH của người dùng
        List<BookingDonation> completedDonations = bookingDonationRepository.findByDonor(user).stream()
                .filter(booking -> booking.getStatus() == Status.COMPLETED)
                .collect(Collectors.toList());

        int totalDonations = completedDonations.size();
        double totalBloodVolume = totalDonations * STANDARD_DONATION_VOLUME;

        // Tìm ngày hiến máu gần nhất
        LocalDate lastDonationDate = completedDonations.stream()
                .map(BookingDonation::getDateDonation)
                .max(LocalDate::compareTo)
                .orElse(null);

        boolean eligibleToDonate = true;
        LocalDate nextEligibleDate = null;
        String message = "Eligible to donate blood";

        // Kiểm tra xem người dùng có thể hiến máu hay không (phải đợi 60 ngày kể từ lần hiến cuối)
        if (lastDonationDate != null) {
            LocalDate today = LocalDate.now();
            long daysSinceLastDonation = ChronoUnit.DAYS.between(lastDonationDate, today);

            if (daysSinceLastDonation < MIN_DAYS_BETWEEN_DONATIONS) {
                eligibleToDonate = false;
                nextEligibleDate = lastDonationDate.plusDays(MIN_DAYS_BETWEEN_DONATIONS);
                message = String.format("Not eligible to donate blood yet. Please wait until %s (%d days remaining)",
                        nextEligibleDate.toString(),
                        MIN_DAYS_BETWEEN_DONATIONS - daysSinceLastDonation);
            }
        }

        // Tạo và trả về báo cáo
        return UserDonationReportResponse.builder()
                .userId(userId)
                .userName(user.getFullName())
                .totalDonations(totalDonations)
                .totalBloodVolume(totalBloodVolume)
                .lastDonationDate(lastDonationDate)
                .eligibleToDonate(eligibleToDonate)
                .nextEligibleDate(nextEligibleDate)
                .message(message)
                .build();
    }

    // Phương thức kiểm tra xem người dùng có thể đặt lịch hiến máu mới hay không
    public boolean canUserDonate(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Can not found user with ID: " + userId));

        // Lấy tất cả các lần hiến máu đã hoàn thành
        List<BookingDonation> completedDonations = bookingDonationRepository.findByDonor(user).stream()
                .filter(booking -> booking.getStatus() == Status.COMPLETED)
                .collect(Collectors.toList());

        // Nếu chưa có lần hiến máu nào trước đây, người dùng có thể hiến máu
        if (completedDonations.isEmpty()) {
            return true;
        }

        // Tìm ngày hiến máu gần nhất
        LocalDate lastDonationDate = completedDonations.stream()
                .map(BookingDonation::getDateDonation)
                .max(LocalDate::compareTo)
                .orElse(null);

        // Nếu có ngày hiến máu gần nhất, kiểm tra thời gian đã trôi qua
        if (lastDonationDate != null) {
            LocalDate today = LocalDate.now();
            long daysSinceLastDonation = ChronoUnit.DAYS.between(lastDonationDate, today);
            return daysSinceLastDonation >= MIN_DAYS_BETWEEN_DONATIONS;
        }

        return true;
    }
}