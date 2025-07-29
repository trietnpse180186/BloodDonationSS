package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.response.NotificationMessageDTO;
import com.swpproject.BloodDonation.entity.Notification;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.enums.NotificationStatus;
import com.swpproject.BloodDonation.repository.NotificationRepository;
import com.swpproject.BloodDonation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Service xử lý gửi thông báo real-time qua WebSocket
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketNotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserLocationService userLocationService;
    private final NotificationEventPublisher eventPublisher;

    /**
     * Gửi notification qua WebSocket (CHỈ gửi, không tạo trong DB)
     */
    public void sendNotificationToUser(String userId, String notificationId,
                                       String title, String message) {
        try {
            NotificationMessageDTO wsMessage = NotificationMessageDTO.builder()
                    .id(notificationId)
                    .title(title)
                    .message(message)
                    .type("NOTIFICATION")
                    .timestamp(LocalDateTime.now())
                    .isRead(false)
                    .priority("NORMAL")
                    .build();

            messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/notifications",
                    wsMessage
            );

            log.info("Sent WebSocket notification {} to user: {}", notificationId, userId);
        } catch (Exception e) {
            log.error("Error sending WebSocket notification: {}", e.getMessage(), e);
        }
    }

    /**
     * Lắng nghe sự kiện thông báo đã được đọc
     */
    @EventListener
    @Async
    public void handleNotificationReadEvent(NotificationReadEvent event) {
        String userId = event.getUserId();
        String notificationId = event.getNotificationId();

        notifyNotificationRead(userId, notificationId);
    }

    /**
     * Gửi thông báo trực tiếp cho một người dùng
     */
    @Async
    public void sendDirectNotification(String userId, String title, String message,
                                       String actionUrl, String type, String priority) {
        try {
            Notification notification = notificationRepository.findByDonor_UserIDAndTitleAndDetail(
                    userId, title, message).orElse(null);

            if (notification != null) {
                String senderUsername = "system";
                String senderName = "System";
                String senderRole = "SYSTEM";

                NotificationMessageDTO wsMessage = NotificationMessageDTO.builder()
                        .id(notification.getId())
                        .title(title)
                        .message(message)
                        .type(type != null ? type : "NOTIFICATION")
                        .actionUrl(actionUrl)
                        .timestamp(LocalDateTime.of(notification.getDate(), notification.getTime()))
                        .isRead(notification.getStatus() == NotificationStatus.READ)
                        .priority(priority != null ? priority : "NORMAL")
                        .build();

                messagingTemplate.convertAndSendToUser(
                        userId,
                        "/queue/notifications",
                        wsMessage
                );

                log.info("Sent WebSocket notification to user: {}", userId);
            }
        } catch (Exception e) {
            log.error("Error sending WebSocket notification: {}", e.getMessage());
        }
    }

    /**
     * Gửi thông báo đến tất cả người dùng trong phạm vi bán kính
     */
    @Async
    public void notifyNearbyUsers(double latitude, double longitude, double radiusKm,
                                  String title, String message, String actionUrl,
                                  String type, String bloodType) {
        try {
            List<User> nearbyUsers = userLocationService.findNearbyUsers(
                    latitude, longitude, radiusKm, bloodType
            );

            log.info("Found {} users within {}km radius", nearbyUsers.size(), radiusKm);

            for (User user : nearbyUsers) {
                double distance = userLocationService.calculateDistance(
                        latitude, longitude, user.getLatitude(), user.getLongitude()
                );

                String distanceMessage = message + "\n(Approximately " +
                        String.format("%.1f", distance) + " km from your location)";

                String priority = distance <= 5 ? "HIGH" : "NORMAL";

                eventPublisher.publishNotificationCreatedEvent(
                        user.getUserID(),
                        title,
                        distanceMessage,
                        actionUrl,
                        type,
                        priority
                );
            }
        } catch (Exception e) {
            log.error("Error sending notification to nearby users: {}", e.getMessage());
        }
    }

    /**
     * Thông báo đã đọc một notification
     */
    public void notifyNotificationRead(String userId, String notificationId) {
        messagingTemplate.convertAndSendToUser(
                userId,
                "/queue/notifications/read",
                notificationId
        );
    }

    /**
     * Gửi thông báo broadcast đến tất cả người dùng
     */
    public void broadcastNotification(String title, String message, String type) {
        NotificationMessageDTO notification = NotificationMessageDTO.builder()
                .id(UUID.randomUUID().toString())
                .title(title)
                .message(message)
                .type(type)
                .timestamp(LocalDateTime.now())
                .build();

        messagingTemplate.convertAndSend("/topic/notifications", notification);
    }
}