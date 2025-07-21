package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.entity.UserHasRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserHasRoleRepository extends JpaRepository<UserHasRole , Long> {
    void deleteByUser(User user);
    List<UserHasRole> findByUser(User user);
}
