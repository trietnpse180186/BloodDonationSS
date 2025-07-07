package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.BookingDonation;
import com.swpproject.BloodDonation.entity.ScheduleDonation;
import com.swpproject.BloodDonation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingDonationRepository extends JpaRepository<BookingDonation, String> {
    List<BookingDonation> findByDonor(User donor);
    List<BookingDonation> findByScheduleDonation(ScheduleDonation schedule);

    @Query("SELECT COUNT(b) FROM BookingDonation b WHERE b.scheduleDonation.scheduleId = :scheduleId")
    Long countByScheduleDonationId(String scheduleId);
}