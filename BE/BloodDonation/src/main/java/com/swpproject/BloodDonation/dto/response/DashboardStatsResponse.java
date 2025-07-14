package com.swpproject.BloodDonation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalDonors;          // Tổng số người hiến máu
    private long totalStaff;           // Tổng số nhân viên
    private long totalDonations;       // Tổng số lượt hiến máu đã hoàn thành
    private double totalBloodVolume;   // Tổng lượng máu đã nhận (tính bằng lít)
    private long pendingDonations;     // Số lượt hiến máu đang chờ xử lý
    private long canceledDonations;    // Số lượt hiến máu đã hủy
}
