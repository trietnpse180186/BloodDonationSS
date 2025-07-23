package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.request.CertificateCreationRequest;
import com.swpproject.BloodDonation.dto.response.CertificateResponse;
import com.swpproject.BloodDonation.entity.Certificate;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.repository.CertificateRepository;
import com.swpproject.BloodDonation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;



    public List<Certificate> getCertificatesByUserId(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return certificateRepository.findByUser(user);
    }
}

