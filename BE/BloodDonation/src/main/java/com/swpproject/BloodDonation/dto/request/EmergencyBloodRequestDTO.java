package com.swpproject.BloodDonation.dto.request;

import com.swpproject.BloodDonation.enums.BloodType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO nhận yêu cầu tạo mới request hiến máu khẩn cấp
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyBloodRequestDTO {

    @NotBlank(message = "Tên bệnh viện không được để trống")
    private String hospitalName;

    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

    @NotBlank(message = "Người liên hệ không được để trống")
    private String contactPerson;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String contactPhone;

    private String description;

    @NotNull(message = "Nhóm máu cần không được để trống")
    private BloodType bloodTypeNeeded;

    @NotNull(message = "Số lượng đơn vị máu không được để trống")
    @Min(value = 1, message = "Số lượng đơn vị máu tối thiểu là 1")
    private Integer unitsNeeded;

    private LocalDateTime expirationTime;

    private String priority;

    private Double latitude;
    private Double longitude;
}