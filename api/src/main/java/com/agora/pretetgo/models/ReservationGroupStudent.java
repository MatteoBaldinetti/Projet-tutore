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

    public ReservationGroupStudent() {}

    public ReservationGroupStudent(ReservationGroup reservationGroup, Student student, GroupRole role, Instant createdAt) {
        this.reservationGroup = reservationGroup;
        this.student = student;
        this.role = role;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ReservationGroup getReservationGroup() {
        return reservationGroup;
    }

    public void setReservationGroup(ReservationGroup reservationGroup) {
        this.reservationGroup = reservationGroup;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public GroupRole getRole() {
        return role;
    }

    public void setRole(GroupRole role) {
        this.role = role;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
