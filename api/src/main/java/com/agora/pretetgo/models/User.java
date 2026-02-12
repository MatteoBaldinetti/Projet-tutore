package com.agora.pretetgo.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "user_type")
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    protected String firstName;

    protected String lastName;

    @Column(unique = true)
    protected String email;

    protected String password;

    @CreationTimestamp
    protected Instant createdAt;

    protected Boolean enabled = true;

    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "user")
    protected List<UserNotification> userNotifications = new ArrayList<>();

    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "reportedBy")
    protected List<Report> reports = new ArrayList<>();

    public User(String firstName, String lastName, String email, String password, Instant createdAt, Boolean enabled) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.enabled = enabled;
    }

}
