package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.LoginRequest;
import com.swpproject.BloodDonation.dto.request.RefreshTokenRequest;
import com.swpproject.BloodDonation.dto.response.LoginResponse;
import com.swpproject.BloodDonation.dto.response.RefreshTokenResponse;
import com.swpproject.BloodDonation.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody @Valid LoginRequest request) {
        return authenticationService.login(request);
    }

    @PostMapping("/logout")
    public void logout(@RequestHeader("Authorization") String token) {
        try {
            authenticationService.logout(token.replace("Bearer ", ""));
        } catch (ParseException e) {
            log.error("Logout error");
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/refresh")
    public RefreshTokenResponse refreshToken(@RequestBody RefreshTokenRequest request) throws ParseException {
        return authenticationService.refreshToken(request);
    }

}
