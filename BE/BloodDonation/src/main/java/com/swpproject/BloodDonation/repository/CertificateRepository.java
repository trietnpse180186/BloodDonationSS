package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.Certificate;
import com.swpproject.BloodDonation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, String> {
    List<Certificate> findByUser(User user);
}
