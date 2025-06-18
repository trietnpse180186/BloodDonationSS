package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface FAQRepository extends JpaRepository<FAQ, Long> {
}
