package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.request.NotificationRequest;
import com.swpproject.BloodDonation.dto.response.NotificationResponse;
import com.swpproject.BloodDonation.service.NotificationEventPublisher;
import com.swpproject.BloodDonation.service.NotificationService;
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
    private final NotificationEventPublisher eventPublisher;

    @PostMapping
    public NotificationResponse createNotification(@RequestBody NotificationRequest request) {

        log.info("Creating notification for user: {}", request.getDonorId());

        // 1. Tạo notification trong database
        NotificationResponse response = notificationService.create(request);
        log.info("Notification created with ID: {}", response.getId());


        // Gửi thông báo qua WebSocket sau khi tạo thông báo
        if (response != null && request.getDonorId() != null) {
            eventPublisher.publishNotificationCreatedEvent(
                    request.getDonorId(),
                    request.getTitle(),
                    request.getDetail(),
                    null, // actionUrl
                    "NOTIFICATION", // type
                    "NORMAL" // priority
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

        // Thông báo qua WebSocket rằng notification đã được đọc
        if (response != null && response.getDonorId() != null) {
            eventPublisher.publishNotificationReadEvent(response.getDonorId(), id);
        }

        return ResponseEntity.ok(response);
    }

    // Thêm endpoint mới cho thông báo WebSocket
    @GetMapping("/unread/count/{userId}")
    public ResponseEntity<Integer> getUnreadCount(@PathVariable String userId) {
        int unreadCount = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(unreadCount);
    }
}