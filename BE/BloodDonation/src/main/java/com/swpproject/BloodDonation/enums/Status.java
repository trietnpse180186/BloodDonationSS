package com.swpproject.BloodDonation.enums;

public enum Status {
    PENDING, // Đã đăng ký, chờ xác nhận
    APPROVED, // Đã phê duyệt đăng ký
    CANCELLED, // Đã hủy đăng ký
    COMPLETED, // Đã hiến máu thành công
    NO_SHOW,// Người hiến không đến theo lịch hẹn
    CHECKED_IN,
    REJECTED // Đăng ký bị từ chối
}
