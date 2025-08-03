package com.swpproject.BloodDonation.enums;

/**
 * Enum định nghĩa các trạng thái của yêu cầu hiến máu khẩn cấp
 */
public enum EmergencyStatus {
    ACTIVE,       // Yêu cầu đang hoạt động, chưa đủ người hiến
    FULFILLED,    // Đã có đủ người đăng ký hiến máu
    COMPLETED,    // Đã hoàn thành yêu cầu (đủ người hiến thành công)
    CANCELLED,    // Yêu cầu đã bị hủy
    CLOSED         // Yêu cầu đã đóng, không còn hoạt động
}