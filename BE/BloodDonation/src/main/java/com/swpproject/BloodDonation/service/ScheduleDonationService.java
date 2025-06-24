package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.entity.ScheduleDonation;
import com.swpproject.BloodDonation.repository.BookingDonationRepository;
import com.swpproject.BloodDonation.repository.ScheduleDonationRepository;
import com.swpproject.BloodDonation.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleDonationService {

    private final ScheduleDonationRepository scheduleDonationRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final BookingDonationRepository bookingDonationRepository;

    public List<ScheduleDonation> getAllScheduleDonations() {
        return scheduleDonationRepository.findAll();
    }

    public ScheduleDonation getScheduleDonationById(String scheduleId) {
        return scheduleDonationRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Schedule donation not found with id: " + scheduleId));
    }
}