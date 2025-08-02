package com.swpproject.BloodDonation.enums;

/**
 * Enum định nghĩa các trạng thái của đăng ký hiến máu khẩn cấp
 */
public enum EmergencyDonationStatus {
    PENDING,     // Đã đăng ký, chờ xác nhận
    CONFIRMED,   // Nhân viên đã xác nhận người hiến sẽ đến
    COMPLETED,   // Đã hiến máu thành công
    NO_SHOW,     // Không đến theo lịch hẹn
    CANCELLED,    // Đã hủy đăng ký
    REJECTED     // Đăng ký bị từ chối
}