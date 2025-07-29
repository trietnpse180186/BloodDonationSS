package com.swpproject.BloodDonation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.swpproject.BloodDonation.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserDetailServiceCustomizer implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .map(user -> {
                    if (!user.isVerified()) {
                        throw new UsernameNotFoundException("Account has not been verified. Please check your email and enter the OTP.");
                    }
                    return user;
                })
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
