package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.Notification;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.enums.NotificationStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByDonor(User donor);

    @Modifying
    @Query("DELETE FROM Notification e WHERE e.donor.id = :userId")
    void deleteByDonorId(@Param("userId") String userId);

    List<Notification> findByDonor_UserIDOrderByDateDescTimeDesc(String donorId);

    Optional<Notification> findByDonor_UserIDAndTitleAndDetail(String userId, String title, String detail);

    int countByDonorUserIDAndStatus(String userId, NotificationStatus status);
}
