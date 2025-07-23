package com.swpproject.BloodDonation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationEventPublisher {

    private final ApplicationEventPublisher eventPublisher;

    public void publishNotificationReadEvent(String userId, String notificationId) {
        NotificationReadEvent event = new NotificationReadEvent(this, userId, notificationId);
        eventPublisher.publishEvent(event);
    }

    public void publishNotificationCreatedEvent(String userId, String title, String message,
                                                String actionUrl, String type, String priority) {
        NotificationCreatedEvent event = new NotificationCreatedEvent(
                this, userId, title, message, actionUrl, type, priority);
        eventPublisher.publishEvent(event);
    }
}