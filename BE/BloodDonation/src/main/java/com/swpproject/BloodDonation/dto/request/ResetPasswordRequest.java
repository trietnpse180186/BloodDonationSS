package com.swpproject.BloodDonation.dto.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String otpCode;
    private String newPassword;
    private String confirmPassword;
}
