package com.agora.pretetgo.models;

import com.agora.pretetgo.enums.GroupRole;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Data
@NoArgsConstructor
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

    public ReservationGroupStudent(ReservationGroup reservationGroup, Student student, GroupRole role, Instant createdAt) {
        this.reservationGroup = reservationGroup;
        this.student = student;
        this.role = role;
        this.createdAt = createdAt;
    }

}
