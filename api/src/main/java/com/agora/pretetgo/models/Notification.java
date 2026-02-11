package com.agora.pretetgo.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    @CreationTimestamp
    private Instant createdAt;

    @OneToMany(mappedBy = "notification")
    private List<UserNotification> userNotifications = new ArrayList<>();

    public Notification(String message, Instant createdAt) {
        this.message = message;
        this.createdAt = createdAt;
    }

}
