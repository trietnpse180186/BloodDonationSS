package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.EmergencyBloodRequest;
import com.swpproject.BloodDonation.entity.EmergencyDonation;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.enums.EmergencyDonationStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface EmergencyDonationRepository extends JpaRepository<EmergencyDonation, String> {

    List<EmergencyDonation> findByDonor(User donor);

    List<EmergencyDonation> findByEmergencyRequest(EmergencyBloodRequest request);

    List<EmergencyDonation> findByStatus(EmergencyDonationStatus status);

    List<EmergencyDonation> findByResponseTimeBetween(LocalDateTime start, LocalDateTime end);

    @Modifying
    @Transactional
    @Query("DELETE FROM EmergencyDonation e WHERE e.donor.id = :userId")
    void deleteByDonorId(@Param("userId") String userId);

    @Query("SELECT COUNT(ed) FROM EmergencyDonation ed WHERE ed.emergencyRequest.requestId = :requestId " +
            "AND ed.status IN ('CONFIRMED', 'COMPLETED')")
    Integer countActiveResponsesByRequestId(@Param("requestId") String requestId);

    boolean existsByEmergencyRequestRequestIdAndDonorUserID(String requestId, String donorId);

    @Query("SELECT COUNT(ed) FROM EmergencyDonation ed " +
            "WHERE ed.status = :status AND ed.responseTime BETWEEN :startDate AND :endDate")
    Integer countByStatusInDateRange(
            @Param("status") EmergencyDonationStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT ed.status, COUNT(ed) FROM EmergencyDonation ed " +
            "WHERE ed.responseTime BETWEEN :startDate AND :endDate " +
            "GROUP BY ed.status")
    List<Object[]> countByStatusAndDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    Optional<EmergencyDonation> findByCheckInCode(String checkInCode);
    boolean existsByCheckInCode(String checkInCode);
    List<EmergencyDonation> findByStatusAndCheckInDeadlineBefore(EmergencyDonationStatus status, LocalDateTime deadline);
}