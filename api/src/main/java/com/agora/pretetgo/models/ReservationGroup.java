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

    public ReservationGroup(String name, Instant createdAt) {
        this.name = name;
        this.createdAt = createdAt;
    }

}
