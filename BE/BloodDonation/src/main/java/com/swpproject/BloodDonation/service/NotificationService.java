package com.swpproject.BloodDonation.service;

import com.swpproject.BloodDonation.dto.request.NotificationRequest;
import com.swpproject.BloodDonation.dto.response.NotificationResponse;
import com.swpproject.BloodDonation.entity.Notification;
import com.swpproject.BloodDonation.entity.User;
import com.swpproject.BloodDonation.enums.NotificationStatus;
import com.swpproject.BloodDonation.repository.NotificationRepository;
import com.swpproject.BloodDonation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @PreAuthorize("hasAuthority('STAFF')")
    public NotificationResponse create(NotificationRequest request) {
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

        Notification saved = notificationRepository.save(notification);

        return NotificationResponse.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .detail(saved.getDetail())
                .date(saved.getDate())
                .time(saved.getTime())
                .status(String.valueOf(saved.getStatus()))
                .donorId(saved.getDonor().getUserID())
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
                        .donorId(notification.getDonor().getUserId())
                        .donorName(notification.getDonor().getFullName())
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

    public NotificationResponse getNotificationById(String id){
        return notificationRepository.findById(id)
                .map(notification -> NotificationResponse.builder()
                        .id(notification.getId())
                        .title(notification.getTitle())
                        .detail(notification.getDetail())
                        .date(notification.getDate())
                        .time(notification.getTime())
                        .status(String.valueOf(notification.getStatus()))
                        .donorId(notification.getDonor().getUserID()).build())
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    @PreAuthorize("isAuthenticated()")
    public void updateStatus (String id, String status){
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        NotificationStatus statusEnum = NotificationStatus.valueOf(status);
        notification.setStatus(statusEnum);
        notificationRepository.save(notification);
    }

    @PreAuthorize("isAuthenticated() AND hasAuthority('DONOR')")
    public void delete(String id) {
        System.out.println("Deleting ID: " + id);
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notificationRepository.delete(notification);
    }

}

