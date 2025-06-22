package com.swpproject.BloodDonation.repository;

import com.swpproject.BloodDonation.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> {

}
