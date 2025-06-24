package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.ScheduleDonation;
import com.swpproject.BloodDonation.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    List<TimeSlot> findByScheduleDonation_ScheduleId(String scheduleId);

    Optional<TimeSlot> findByScheduleDonationAndStartTimeAndEndTime(
            ScheduleDonation scheduleDonation,
            LocalTime startTime,
            LocalTime endTime);
}