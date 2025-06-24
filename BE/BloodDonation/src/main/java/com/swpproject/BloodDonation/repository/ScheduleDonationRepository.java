package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.ScheduleDonation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ScheduleDonationRepository extends JpaRepository<ScheduleDonation, String> {
    Optional<ScheduleDonation> findByDateAndAddress(LocalDate date, String address);
}