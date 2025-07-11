package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.Notification;
import com.swpproject.BloodDonation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByDonor(User donor);
}