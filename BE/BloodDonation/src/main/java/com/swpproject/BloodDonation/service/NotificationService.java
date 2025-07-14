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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

        private final NotificationRepository notificationRepository;
        private final UserRepository userRepository;

        @PreAuthorize("hasAuthority('STAFF')")
        public NotificationResponse create(NotificationRequest request) {
                log.info(request.getDonorId());
                User donor = userRepository.findById(request.getDonorId())
                                .orElseThrow(() -> new RuntimeException("Donor not found"));

                Notification notification = Notification.builder()
                                .title(request.getTitle())
                                .detail(request.getDetail())
                                .date(request.getDate())
                                .time(request.getTime())
                                .status(NotificationStatus.UNREAD)
                                .donor(donor)
                                .build();

                notificationRepository.save(notification);

                return NotificationResponse.builder()
                                .id(notification.getId())
                                .title(notification.getTitle())
                                .detail(notification.getDetail())
                                .date(notification.getDate())
                                .time(notification.getTime())
                                .status(String.valueOf(notification.getStatus()))
                                .donorId(notification.getDonor().getUserID())
                                .build();
        }

        @PreAuthorize("hasAuthority('STAFF')")
        public List<NotificationResponse> getAllNotification() {
                return notificationRepository.findAll()
                                .stream()
                                .map(notification -> NotificationResponse.builder()
                                                .id(notification.getId())
                                                .title(notification.getTitle())
                                                .detail(notification.getDetail())
                                                .date(notification.getDate())
                                                .time(notification.getTime())
                                                .status(String.valueOf(notification.getStatus()))
                                                .donorId(notification.getDonor().getFullName())
                                                .build())
                                .toList();
        }

        @PreAuthorize("isAuthenticated()")
        public List<NotificationResponse> getByUserId(String userId) {
                User donor = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                return notificationRepository.findByDonor(donor)
                                .stream()
                                .map(n -> NotificationResponse.builder()
                                                .id(n.getId())
                                                .title(n.getTitle())
                                                .detail(n.getDetail())
                                                .date(n.getDate())
                                                .time(n.getTime())
                                                .status(String.valueOf(n.getStatus()))
                                                .donorId(userId)
                                                .build())
                                .collect(Collectors.toList());
        }

        @PreAuthorize("isAuthenticated()")
        public void delete(String id) {
                System.out.println("Deleting ID: " + id);
                Notification notification = notificationRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Notification not found"));
                notificationRepository.delete(notification);
        }

        @PreAuthorize("isAuthenticated()")
        public NotificationResponse markAsRead(String id) {
                log.info("Marking notification as read: {}", id);
                Notification notification = notificationRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Notification not found"));

                notification.setStatus(NotificationStatus.READ);
                notificationRepository.save(notification);

                return NotificationResponse.builder()
                                .id(notification.getId())
                                .title(notification.getTitle())
                                .detail(notification.getDetail())
                                .date(notification.getDate())
                                .time(notification.getTime())
                                .status(String.valueOf(notification.getStatus()))
                                .donorId(notification.getDonor().getUserID())
                                .build();
        }

}
