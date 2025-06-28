package com.swpproject.BloodDonation.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResetPasswordResponse {
    private String message;
}
