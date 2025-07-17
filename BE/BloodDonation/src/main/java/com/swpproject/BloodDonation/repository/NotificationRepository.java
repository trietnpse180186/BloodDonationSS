package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.Notification;
import com.swpproject.BloodDonation.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByDonor(User donor);
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM notification WHERE userid = :userId", nativeQuery = true)
    void deleteByUserId(@Param("userId") String userId);
}
