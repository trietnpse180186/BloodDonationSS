package com.swpproject.BloodDonation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDonationReportResponse {
    private String userId;
    private String userName;
    private int totalDonations; // Tổng số lần hiến máu đã hoàn thành
    private double totalBloodVolume; // Tổng lượng máu (tính bằng lít)
    private LocalDate lastDonationDate; // Ngày hiến máu gần nhất
    private boolean eligibleToDonate; // Người dùng có đủ điều kiện hiến máu không
    private LocalDate nextEligibleDate; // Ngày đủ điều kiện hiến máu tiếp theo
    private String message; // Thông báo về tình trạng đủ điều kiện
}