package com.swpproject.BloodDonation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.swpproject.BloodDonation.entity.InvalidtedToken;

@Repository
public interface InvalidtedTokenRepository extends JpaRepository<InvalidtedToken, String> {
}
