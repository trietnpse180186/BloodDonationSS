package com.swpproject.BloodDonation.enums;

/**
 * Mức độ khẩn cấp cho yêu cầu hiến máu
 */
public enum UrgencyLevel {
    CRITICAL,   // Cần máu ngay lập tức (2-6 giờ)
    HIGH,       // Cần máu nhanh (12 giờ)
    MEDIUM,     // Cần máu trong ngày (24 giờ)
    LOW         // Cần máu không gấp (48 giờ)
}