package com.agora.pretetgo.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
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

    public UserNotification(Notification notification, User user, Instant readAt, Boolean isRead) {
        this.notification = notification;
        this.user = user;
        this.readAt = readAt;
        this.isRead = isRead;
    }

}
