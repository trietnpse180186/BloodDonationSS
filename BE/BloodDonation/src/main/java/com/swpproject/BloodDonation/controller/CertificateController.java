package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.CertificateCreationRequest;
import com.swpproject.BloodDonation.dto.response.CertificateResponse;
import com.swpproject.BloodDonation.entity.Certificate;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.repository.CertificateRepository;
import com.swpproject.BloodDonation.repository.UserRepository;
import com.swpproject.BloodDonation.service.CertificateService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;
    private final UserRepository userRepository;
    private final CertificateRepository certificateRepository;

@GetMapping("/user/{userId}")
public ResponseEntity<List<Certificate>> getCertificatesByUser(@PathVariable String userId) {
    List<Certificate> certificates = certificateService.getCertificatesByUserId(userId);
    return ResponseEntity.ok(certificates);
}

}
