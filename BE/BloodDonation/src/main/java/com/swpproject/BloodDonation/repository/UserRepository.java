package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.enums.BloodType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    @Query("Select u from User u where u.email= :email")
    Optional<User> findByEmail(String email);

    List<User> findByBloodType(BloodType bloodType);

    @Query("SELECT DISTINCT u FROM User u JOIN u.userHasRoles uhr JOIN uhr.role r WHERE r.name IN ('STAFF', 'ADMIN')")
    List<User> findAllStaffAndAdmin();
}