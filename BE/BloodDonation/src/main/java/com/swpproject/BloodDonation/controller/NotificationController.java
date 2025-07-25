package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.NotificationRequest;
import com.swpproject.BloodDonation.dto.response.NotificationResponse;
import com.swpproject.BloodDonation.service.NotificationService;
import com.swpproject.BloodDonation.service.WebSocketNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final NotificationService notificationService;
    private final WebSocketNotificationService webSocketNotificationService;

    @PostMapping
    public NotificationResponse createNotification(@RequestBody NotificationRequest request) {
        log.info("Creating notification for user: {}", request.getDonorId());

        // 1. Tạo notification trong database
        NotificationResponse response = notificationService.create(request);
        log.info("Notification created with ID: {}", response.getId());

        // 2. CHỈ gửi WebSocket notification (không tạo thêm)
        if (response != null && request.getDonorId() != null) {
            webSocketNotificationService.sendNotificationToUser(
                    request.getDonorId(),
                    response.getId(),
                    request.getTitle(),
                    request.getDetail()
            );
            log.info("WebSocket notification sent to user: {}", request.getDonorId());
        }

        return response;
    }

    @GetMapping("/user/{userId}")
    public List<NotificationResponse> getNotificationsByUserId(@PathVariable String userId) {
        return notificationService.getByUserId(userId);
    }

    @GetMapping("/all")
    public List<NotificationResponse> getAllNotification() {
        return notificationService.getAllNotification();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        notificationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable String id) {
        NotificationResponse response = notificationService.markAsRead(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread/count/{userId}")
    public ResponseEntity<Integer> getUnreadCount(@PathVariable String userId) {
        int unreadCount = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(unreadCount);
    }
}