package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.BookingDonation;
import com.swpproject.BloodDonation.entity.ScheduleDonation;
import com.swpproject.BloodDonation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingDonationRepository extends JpaRepository<BookingDonation, String> {
    List<BookingDonation> findByDonor(User donor);
    List<BookingDonation> findByScheduleDonation(ScheduleDonation scheduleDonation);
}