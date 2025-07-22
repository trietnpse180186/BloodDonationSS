package com.swpproject.BloodDonation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO thống kê về yêu cầu hiến máu khẩn cấp
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyStatisticsDTO {
    // Thống kê yêu cầu
    private int totalRequests;            // Tổng số yêu cầu
    private int activeRequests;           // Số yêu cầu đang hoạt động
    private int fulfilledRequests;        // Số yêu cầu đã đủ người đăng ký
    private int completedRequests;        // Số yêu cầu đã hoàn thành
    private int cancelledRequests;        // Số yêu cầu đã hủy

    // Thống kê đăng ký hiến máu
    private int totalDonationsRegistered; // Tổng số đăng ký hiến máu
    private int pendingDonations;         // Số đăng ký đang chờ xác nhận
    private int confirmedDonations;       // Số đăng ký đã xác nhận
    private int completedDonations;       // Số đăng ký đã hoàn thành hiến máu
    private int noShowDonations;          // Số đăng ký không đến hiến máu
    private int cancelledDonations;       // Số đăng ký đã hủy

    // Các tỷ lệ
    private double completionRate;        // Tỷ lệ hoàn thành (%)
    private double responseRate;          // Tỷ lệ phản hồi (%)

    // Thống kê chi tiết
    private Map<String, Integer> requestsByBloodType;   // Thống kê yêu cầu theo nhóm máu
    private Map<String, Double> averageResponseTime;    // Thời gian phản hồi trung bình (phút)
}