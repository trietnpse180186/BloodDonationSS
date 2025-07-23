package com.swpproject.BloodDonation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO dùng để gửi thông báo WebSocket
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationMessageDTO {
    private String id;
    private String title;
    private String message;
    private String type; // Loại thông báo
    private String actionUrl; // URL khi click vào thông báo
    private LocalDateTime timestamp; // Thời gian thông báo
    private boolean isRead; // Trạng thái đã đọc
    private String priority; // Mức độ ưu tiên: "NORMAL", "HIGH", "URGENT"
}