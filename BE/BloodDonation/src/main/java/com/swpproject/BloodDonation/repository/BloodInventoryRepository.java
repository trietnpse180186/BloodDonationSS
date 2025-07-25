package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.BloodInventory;
import com.swpproject.BloodDonation.enums.BloodType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BloodInventoryRepository extends JpaRepository<BloodInventory, String> {

    List<BloodInventory> findByBloodTypeAndStatus(BloodType bloodType, String status);

    @Query("SELECT SUM(b.quantity) FROM BloodInventory b WHERE b.bloodType = :bloodType AND b.status = 'AVAILABLE' AND b.expiryDate > :now")
    Double getTotalAvailableQuantity(@Param("bloodType") BloodType bloodType, @Param("now") LocalDateTime now);

    @Query("SELECT b FROM BloodInventory b WHERE b.status = 'AVAILABLE' AND b.expiryDate > :now ORDER BY b.expiryDate ASC")
    List<BloodInventory> findAvailableBloodOrderByExpiryDate(@Param("now") LocalDateTime now);

    @Query("SELECT b FROM BloodInventory b WHERE b.status = 'AVAILABLE' AND b.expiryDate BETWEEN :now AND :expiry")
    List<BloodInventory> findExpiringBlood(@Param("now") LocalDateTime now, @Param("expiry") LocalDateTime expiry);

    @Query("SELECT b FROM BloodInventory b WHERE b.status = 'AVAILABLE' AND b.bloodType = :bloodType AND b.expiryDate > :now ORDER BY b.expiryDate ASC")
    List<BloodInventory> findAvailableBloodByTypeOrderByExpiryDate(@Param("bloodType") BloodType bloodType, @Param("now") LocalDateTime now);

    @Query("SELECT SUM(b.quantity) FROM BloodInventory b WHERE b.status = 'USED' AND b.lastUpdatedTime BETWEEN :start AND :end")
    Double getUsedBloodInPeriod(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT SUM(b.quantity) FROM BloodInventory b WHERE b.bloodType = :bloodType AND b.status = 'USED' AND b.lastUpdatedTime BETWEEN :start AND :end")
    Double getUsedBloodByTypeInPeriod(@Param("bloodType") BloodType bloodType, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT SUM(b.quantity) FROM BloodInventory b WHERE b.receivedDate BETWEEN :start AND :end")
    Double getReceivedBloodInPeriod(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT SUM(b.quantity) FROM BloodInventory b WHERE b.bloodType = :bloodType AND b.receivedDate BETWEEN :start AND :end")
    Double getReceivedBloodByTypeInPeriod(@Param("bloodType") BloodType bloodType, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}