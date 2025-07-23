package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.EmergencyBloodRequest;
import com.swpproject.BloodDonation.enums.BloodType;
import com.swpproject.BloodDonation.enums.EmergencyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmergencyBloodRequestRepository extends JpaRepository<EmergencyBloodRequest, String> {

    List<EmergencyBloodRequest> findByStatus(EmergencyStatus status);

    List<EmergencyBloodRequest> findByBloodTypeNeeded(BloodType bloodType);

    List<EmergencyBloodRequest> findByStatusAndExpirationTimeAfter(
            EmergencyStatus status, LocalDateTime time);

    List<EmergencyBloodRequest> findByIsRareBloodType(boolean isRare);

    // Tìm các yêu cầu trong khoảng thời gian
    List<EmergencyBloodRequest> findByRequestTimeBetween(LocalDateTime start, LocalDateTime end);

    // Tìm các yêu cầu gần vị trí hiện tại
    @Query(value = "SELECT * FROM emergency_blood_requests e WHERE " +
            "e.status = 'ACTIVE' AND " +
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(e.latitude)) * " +
            "cos(radians(e.longitude) - radians(:longitude)) + " +
            "sin(radians(:latitude)) * sin(radians(e.latitude)))) <= :radiusKm " +
            "ORDER BY (6371 * acos(cos(radians(:latitude)) * cos(radians(e.latitude)) * " +
            "cos(radians(e.longitude) - radians(:longitude)) + " +
            "sin(radians(:latitude)) * sin(radians(e.latitude))))",
            nativeQuery = true)
    List<EmergencyBloodRequest> findNearbyRequests(
            @Param("latitude") Double latitude,
            @Param("longitude") Double longitude,
            @Param("radiusKm") Double radiusKm
    );

    // Thống kê theo nhóm máu
    @Query("SELECT e.bloodTypeNeeded, COUNT(e) FROM EmergencyBloodRequest e " +
            "WHERE e.requestTime BETWEEN :startDate AND :endDate " +
            "GROUP BY e.bloodTypeNeeded")
    List<Object[]> countByBloodTypeAndDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // Tỷ lệ hoàn thành yêu cầu
    @Query("SELECT COUNT(e) FROM EmergencyBloodRequest e " +
            "WHERE e.status = 'COMPLETED' AND e.requestTime BETWEEN :startDate AND :endDate")
    Integer countCompletedInDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}