package com.swpproject.BloodDonation.dto.request;

import lombok.Data;

@Data
public class VerifyOtpRequest {
    private String email;
    private String otpCode;
}
