package com.agora.pretetgo.models;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
public class ReservationGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @CreationTimestamp
    private Instant createdAt;

    @OneToMany(mappedBy = "reservationGroup")
    private List<ReservationGroupStudent> reservationGroupStudents = new ArrayList<>();

    @OneToMany(mappedBy = "reservedBy")
    private List<Reservation> reservations = new ArrayList<>();

    public ReservationGroup() {}

    public ReservationGroup(String name, Instant createdAt) {
        this.name = name;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public List<ReservationGroupStudent> getReservationGroupStudents() {
        return reservationGroupStudents;
    }

    public void setReservationGroupStudents(List<ReservationGroupStudent> reservationGroupStudents) {
        this.reservationGroupStudents = reservationGroupStudents;
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }
}
