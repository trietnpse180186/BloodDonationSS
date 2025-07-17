package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.BookingDonation;
import com.swpproject.BloodDonation.entity.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, String> {
    List<Survey> findByBookingDonation(BookingDonation bookingDonation);
    void deleteAllByBookingDonation(BookingDonation bookingDonation);
}