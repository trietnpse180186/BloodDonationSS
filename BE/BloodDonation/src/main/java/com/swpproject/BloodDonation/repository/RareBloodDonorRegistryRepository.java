package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.RareBloodDonorRegistry;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.enums.BloodType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RareBloodDonorRegistryRepository extends JpaRepository<RareBloodDonorRegistry, String> {

    List<RareBloodDonorRegistry> findByBloodType(BloodType bloodType);

    Optional<RareBloodDonorRegistry> findByDonor(User donor);

    List<RareBloodDonorRegistry> findByIsAvailableForEmergency(boolean isAvailable);

    @Query("SELECT r FROM RareBloodDonorRegistry r WHERE r.bloodType = :bloodType " +
            "AND r.isAvailableForEmergency = true " +
            "ORDER BY " +
            "(6371 * acos(cos(radians(:latitude)) * cos(radians(r.homeLatitude)) * " +
            "cos(radians(r.homeLongitude) - radians(:longitude)) + " +
            "sin(radians(:latitude)) * sin(radians(r.homeLatitude))))")
    List<RareBloodDonorRegistry> findAvailableDonorsByBloodTypeOrderByDistance(
            @Param("bloodType") BloodType bloodType,
            @Param("latitude") double latitude,
            @Param("longitude") double longitude);
}