package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.repository.BookingDonationRepository;
import com.swpproject.BloodDonation.repository.EmergencyDonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class CheckInCodeService {

    private final BookingDonationRepository bookingDonationRepository;
    private final EmergencyDonationRepository emergencyRepository;

    private static final Random random = new Random();
    private static final String CODE_PREFIX = "HIENMAU-";

    /**
     * Tạo mã check-in duy nhất cho hiến máu
     */
    public String generateUniqueCode() {
        String code;
        boolean isUnique = false;

        do {
            // Tạo mã số 3 chữ số
            int randomNum = 100 + random.nextInt(900);
            code = CODE_PREFIX + randomNum;

            // Kiểm tra tính duy nhất
            isUnique = !bookingDonationRepository.existsByCheckInCode(code) &&
                    !emergencyRepository.existsByCheckInCode(code);

        } while (!isUnique);

        return code;
    }
}