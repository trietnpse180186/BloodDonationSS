package com.swpproject.BloodDonation.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactRequest {
    private String fullName;
    private String phoneNumber;
    private String email;
    private String details;
}
