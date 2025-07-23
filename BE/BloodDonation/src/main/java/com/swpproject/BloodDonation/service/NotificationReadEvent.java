package com.swpproject.BloodDonation.service;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class NotificationReadEvent extends ApplicationEvent {

    private final String userId;
    private final String notificationId;

    public NotificationReadEvent(Object source, String userId, String notificationId) {
        super(source);
        this.userId = userId;
        this.notificationId = notificationId;
    }
}