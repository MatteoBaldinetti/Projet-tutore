package com.agora.pretetgo.models;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
public class UserNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "notification_id")
    private Notification notification;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Instant readAt;

    private Boolean isRead = false;
}
