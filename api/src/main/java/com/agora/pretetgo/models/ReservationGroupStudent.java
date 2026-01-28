package com.agora.pretetgo.models;

import com.agora.pretetgo.enums.GroupRole;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
public class ReservationGroupStudent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reservation_group_id")
    private ReservationGroup reservationGroup;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @Enumerated(EnumType.STRING)
    private GroupRole role;

    @CreationTimestamp
    private Instant createdAt;
}
