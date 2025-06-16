package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    @Query("Select u from User u where u.email= :email")
    Optional<User> findByEmail(String email);
}