package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.request.NotificationRequest;
import com.swpproject.BloodDonation.dto.response.NotificationResponse;
import com.swpproject.BloodDonation.entity.Notification;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.enums.NotificationStatus;
import com.swpproject.BloodDonation.repository.NotificationRepository;
import com.swpproject.BloodDonation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

        private final NotificationRepository notificationRepository;
        private final UserRepository userRepository;
        private final NotificationEventPublisher eventPublisher;

        /**
         * Lắng nghe sự kiện tạo thông báo
         */
        @EventListener
        @Transactional
        public void handleNotificationCreatedEvent(NotificationCreatedEvent event) {
                NotificationRequest request = NotificationRequest.builder()
                        .title(event.getTitle())
                        .detail(event.getMessage())
                        .date(LocalDateTime.now().toLocalDate())
                        .time(LocalDateTime.now().toLocalTime().withNano(0))
                        .donorId(event.getUserId())
                        .build();

                create(request);
        }

        /**
         * Tạo thông báo mới
         */
        @Transactional
        public NotificationResponse create(NotificationRequest request) {
                User donor = userRepository.findById(request.getDonorId())
                        .orElseThrow(() -> new RuntimeException("User not found"));

                Notification notification = Notification.builder()
                        .id(UUID.randomUUID().toString())
                        .title(request.getTitle())
                        .detail(request.getDetail())
                        .date(request.getDate() != null ? request.getDate() : LocalDateTime.now().toLocalDate())
                        .time((request.getTime() != null ? request.getTime() : LocalDateTime.now().toLocalTime()).withNano(0)) // Thêm .withNano(0)
                        .donor(donor)
                        .status(NotificationStatus.UNREAD)
                        .build();

                Notification savedNotification = notificationRepository.save(notification);
                return mapToResponse(savedNotification);
        }

        /**
         * Lấy thông báo theo ID và userID (kiểm tra quyền)
         */
        public NotificationResponse getById(String id, String userId) {
                Notification notification = notificationRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Notification not found"));

                // Kiểm tra xem thông báo có thuộc về người dùng không
                if (!notification.getDonor().getUserID().equals(userId)) {
                        throw new RuntimeException("You don't have permission to view this notification");
                }

                return mapToResponse(notification);
        }

        /**
         * Lấy danh sách thông báo của một người dùng
         */
        public List<NotificationResponse> getByUserId(String userId) {
                List<Notification> notifications = notificationRepository.findByDonor_UserIDOrderByDateDescTimeDesc(userId);
                return notifications.stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList());
        }

        /**
         * Lấy tất cả thông báo (Admin)
         */
        public List<NotificationResponse> getAllNotification() {
                return notificationRepository.findAll().stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList());
        }

        /**
         * Xóa thông báo
         */
        @Transactional
        public void delete(String id) {
                Notification notification = notificationRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Notification not found"));

                notificationRepository.delete(notification);
        }

        /**
         * Xóa thông báo (kiểm tra quyền)
         */
        @Transactional
        public void deleteNotification(String id, String userId) {
                Notification notification = notificationRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Notification not found"));

                // Kiểm tra quyền
                if (!notification.getDonor().getUserID().equals(userId)) {
                        throw new RuntimeException("You don't have permission to delete this notification");
                }

                notificationRepository.delete(notification);
        }

        /**
         * Đánh dấu thông báo đã đọc
         */
        @Transactional
        public NotificationResponse markAsRead(String id) {
                Notification notification = notificationRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Notification not found"));

                notification.setStatus(NotificationStatus.READ);
                Notification updatedNotification = notificationRepository.save(notification);

                return mapToResponse(updatedNotification);
        }

        /**
         * Đánh dấu thông báo đã đọc và thông báo qua WebSocket
         */
        @Transactional
        public void markAsReadWebSocket(String notificationId) {
                Notification notification = notificationRepository.findById(notificationId)
                        .orElseThrow(() -> new RuntimeException("Notification not found"));

                notification.setStatus(NotificationStatus.READ);
                notificationRepository.save(notification);

                // Phát ra sự kiện thay vì gọi trực tiếp
                eventPublisher.publishNotificationReadEvent(
                        notification.getDonor().getUserID(),
                        notificationId
                );

                log.info("Notification {} marked as read via WebSocket", notificationId);
        }

        /**
         * Đánh dấu tất cả thông báo của người dùng là đã đọc
         */
        @Transactional
        public void markAllAsRead(String userId) {
                List<Notification> unreadNotifications = notificationRepository.findByDonor_UserIDOrderByDateDescTimeDesc(userId)
                        .stream()
                        .filter(n -> n.getStatus() == NotificationStatus.UNREAD)
                        .collect(Collectors.toList());

                for (Notification notification : unreadNotifications) {
                        notification.setStatus(NotificationStatus.READ);
                        notificationRepository.save(notification);

                        // Phát ra sự kiện thay vì gọi trực tiếp
                        eventPublisher.publishNotificationReadEvent(userId, notification.getId());
                }

                log.info("Marked {} notifications as read for user {}", unreadNotifications.size(), userId);
        }

        /**
         * Lấy danh sách thông báo cho người dùng hiện tại
         */
        public List<NotificationResponse> getAllByDonorId(String donorId) {
                List<Notification> notifications = notificationRepository.findByDonor_UserIDOrderByDateDescTimeDesc(donorId);
                return notifications.stream()
                        .map(this::mapToResponse)
                        .collect(Collectors.toList());
        }

        /**
         * Đếm số lượng thông báo chưa đọc
         */
        public int getUnreadCount(String userId) {
                return notificationRepository.countByDonorUserIDAndStatus(userId, NotificationStatus.UNREAD);
        }

        /**
         * Chuyển đổi từ entity sang DTO
         */
        private NotificationResponse mapToResponse(Notification notification) {
                return NotificationResponse.builder()
                        .id(notification.getId())
                        .title(notification.getTitle())
                        .detail(notification.getDetail())
                        .date(notification.getDate())
                        .time(notification.getTime())
                        .donorId(notification.getDonor().getUserID())
                        .donorName(notification.getDonor().getFullName())
                        .status(notification.getStatus())
                        .build();
        }

        /**
         * Gửi thông báo mới đến người dùng (kết hợp lưu DB và WebSocket)
         */
        @Transactional
        public NotificationResponse sendNotification(String userId, String title, String message, String actionUrl, String type, String priority) {
                // Tạo thông báo trong DB
                NotificationRequest request = NotificationRequest.builder()
                        .title(title)
                        .detail(message)
                        .date(LocalDateTime.now().toLocalDate())
                        .time(LocalDateTime.now().toLocalTime())
                        .donorId(userId)
                        .build();

                NotificationResponse notification = create(request);

                // Phát ra sự kiện thay vì gọi trực tiếp
                eventPublisher.publishNotificationCreatedEvent(
                        userId,
                        title,
                        message,
                        actionUrl,
                        type != null ? type : "NOTIFICATION",
                        priority != null ? priority : "NORMAL"
                );

                return notification;
        }

        /**
         * Gửi thông báo đến nhóm người dùng
         */
        @Transactional
        public void sendNotificationToUsers(List<String> userIds, String title, String message, String actionUrl, String type, String priority) {
                for (String userId : userIds) {
                        sendNotification(userId, title, message, actionUrl, type, priority);
                }
        }
}