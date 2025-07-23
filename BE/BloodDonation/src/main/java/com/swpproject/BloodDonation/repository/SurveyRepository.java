package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.BookingDonation;
import com.swpproject.BloodDonation.entity.Survey;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, String> {
    List<Survey> findByBookingDonation(BookingDonation bookingDonation);
    void deleteAllByBookingDonation(BookingDonation bookingDonation);
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM survey WHERE donation_id = :donationId", nativeQuery = true)
    void deleteByDonationId(@Param("donationId") String donationId);
}