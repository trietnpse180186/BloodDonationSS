package com.swpproject.BloodDonation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContactResponse {
    private Long id;
    private String fullName;
    private String phoneNumber;
    private String email;
    private String details;
}
