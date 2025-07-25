package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.BloodInventoryBatch;
import com.swpproject.BloodDonation.enums.BloodType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BloodInventoryBatchRepository extends JpaRepository<BloodInventoryBatch, String> {

    List<BloodInventoryBatch> findByBloodTypeAndStatus(BloodType bloodType, String status);

    @Query("SELECT b FROM BloodInventoryBatch b WHERE b.status = 'ACTIVE' AND b.remainingQuantity > 0 ORDER BY b.expiryDate ASC")
    List<BloodInventoryBatch> findActiveOrderByExpiryDate();

    @Query("SELECT SUM(b.remainingQuantity) FROM BloodInventoryBatch b WHERE b.bloodType = :bloodType AND b.status = 'ACTIVE' AND b.expiryDate > :now")
    Double getRemainingQuantityByBloodType(@Param("bloodType") BloodType bloodType, @Param("now") LocalDateTime now);

    @Query("SELECT b FROM BloodInventoryBatch b WHERE b.status = 'ACTIVE' AND b.expiryDate BETWEEN :now AND :expiry")
    List<BloodInventoryBatch> findExpiringBatches(@Param("now") LocalDateTime now, @Param("expiry") LocalDateTime expiry);
}