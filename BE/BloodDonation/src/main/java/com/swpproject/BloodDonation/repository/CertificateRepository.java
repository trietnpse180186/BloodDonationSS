package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.Certificate;
import com.swpproject.BloodDonation.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, String> {
    List<Certificate> findByUser(User user);
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM certificate WHERE user_id = :userId", nativeQuery = true)
    void deleteByUserId(@Param("userId") String userId);
}
