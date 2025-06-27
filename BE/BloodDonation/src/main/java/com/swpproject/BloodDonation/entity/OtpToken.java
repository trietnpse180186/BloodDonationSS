package com.swpproject.BloodDonation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpToken {
    @Id
    private String email;
    private String otpCode;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    @Column(name = "used") // Đảm bảo tên cột khớp với cơ sở dữ liệu
    private boolean used;
}
