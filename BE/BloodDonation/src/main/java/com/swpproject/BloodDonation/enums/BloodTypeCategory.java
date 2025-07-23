package com.swpproject.BloodDonation.enums;

/**
 * Phân loại nhóm máu theo mức độ phổ biến
 */
public enum BloodTypeCategory {
    COMMON,     // Nhóm máu phổ biến (O+, A+, B+)
    UNCOMMON,   // Nhóm máu ít phổ biến (AB+)
    RARE,       // Nhóm máu hiếm (O-, A-, B-)
    VERY_RARE   // Nhóm máu rất hiếm (AB-, Bombay...)
}