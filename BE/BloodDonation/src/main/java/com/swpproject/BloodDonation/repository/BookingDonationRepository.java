package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.BookingDonation;
import com.swpproject.BloodDonation.entity.ScheduleDonation;
import com.swpproject.BloodDonation.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingDonationRepository extends JpaRepository<BookingDonation, String> {

    List<BookingDonation> findByDonor(User donor);
    List<BookingDonation> findByScheduleDonation(ScheduleDonation schedule);

    @Query("SELECT b.donationId FROM BookingDonation b WHERE b.donor.userID = :userId")
    List<String> findDonationIdsByDonorUserId(@Param("userId") String userId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM survey WHERE donation_id IN (:donationIds)", nativeQuery = true)
    void deleteSurveysByDonationIds(@Param("donationIds") List<String> donationIds);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM booking_donation WHERE donor_id = :userId", nativeQuery = true)
    void deleteByDonorId(@Param("userId") String userId);

    @Query("SELECT COUNT(b) FROM BookingDonation b WHERE b.scheduleDonation.scheduleId = :scheduleId")
    Long countByScheduleDonationId(String scheduleId);

    @Query("SELECT b FROM BookingDonation b WHERE b.donor = :donor AND b.status = 'COMPLETED' ORDER BY b.dateDonation DESC")
    List<BookingDonation> findCompletedDonationsByDonorOrderByDateDesc(User donor);
}
