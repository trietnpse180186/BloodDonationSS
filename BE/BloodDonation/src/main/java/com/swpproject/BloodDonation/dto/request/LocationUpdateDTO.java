package com.swpproject.BloodDonation.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO nhận thông tin cập nhật vị trí người dùng
 */
@Data
public class LocationUpdateDTO {
    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    private Boolean allowLocationTracking;
}