package com.swpproject.BloodDonation.service;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class NotificationCreatedEvent extends ApplicationEvent {

    private final String userId;
    private final String title;
    private final String message;
    private final String actionUrl;
    private final String type;
    private final String priority;

    public NotificationCreatedEvent(Object source, String userId, String title,
                                    String message, String actionUrl, String type, String priority) {
        super(source);
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.actionUrl = actionUrl;
        this.type = type;
        this.priority = priority;
    }
}