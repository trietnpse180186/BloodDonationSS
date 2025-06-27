package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OtpTokenRepository extends JpaRepository<OtpToken, String> {
}
