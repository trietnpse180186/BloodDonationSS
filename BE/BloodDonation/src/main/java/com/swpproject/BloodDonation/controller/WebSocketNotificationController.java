package com.swpproject.BloodDonation.controller;

import com.swpproject.BloodDonation.dto.response.NotificationMessageDTO;
import com.swpproject.BloodDonation.service.NotificationEventPublisher;
import com.swpproject.BloodDonation.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;

/**
 * Controller xử lý các tương tác WebSocket và REST cho thông báo
 */
@Controller
@RequiredArgsConstructor
public class WebSocketNotificationController {

    private final NotificationEventPublisher eventPublisher;
    private final NotificationService notificationService;

    /**
     * Endpoint WebSocket để đánh dấu thông báo đã đọc
     */
    @MessageMapping("/notifications/mark-read")
    public void markNotificationAsRead(@Payload String notificationId, Principal principal,
                                       SimpMessageHeaderAccessor headerAccessor) {
        String userId = principal.getName();
        notificationService.markAsReadWebSocket(notificationId);
    }

    /**
     * REST endpoint để đánh dấu thông báo đã đọc và thông báo qua WebSocket
     */
    @PutMapping("/api/notifications/{id}/read")
    @PreAuthorize("isAuthenticated()")
    @ResponseBody
    public void markAsRead(@PathVariable("id") String id, Authentication authentication) {
        String userId = authentication.getName();
        notificationService.markAsReadWebSocket(id);
    }

    /**
     * REST endpoint để gửi thông báo test
     */
    @RequestMapping("/api/notifications/test-ws")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseBody
    public NotificationMessageDTO sendTestNotification(Principal principal) {
        String userId = principal.getName();

        NotificationMessageDTO notification = NotificationMessageDTO.builder()
                .title("Test Notification")
                .message("This is a test WebSocket notification")
                .type("TEST")
                .priority("NORMAL")
                .timestamp(LocalDateTime.now())
                .build();

        eventPublisher.publishNotificationCreatedEvent(
                userId,
                notification.getTitle(),
                notification.getMessage(),
                "/home",
                notification.getType(),
                notification.getPriority()
        );

        return notification;
    }

    /**
     * WebSocket endpoint cho người dùng khi kết nối
     */
    @MessageMapping("/notifications/connect")
    public void onConnect(Principal principal) {
        String userId = principal.getName();
        // Có thể gửi thông báo chào mừng hoặc đánh dấu người dùng online
        // Code xử lý kết nối...

        // Ghi log người dùng kết nối
        System.out.println("User connected to WebSocket: " + userId + " at " +
                LocalDateTime.now().toString());
    }
}