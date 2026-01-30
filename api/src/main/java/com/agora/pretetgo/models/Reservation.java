package com.agora.pretetgo.models;

import com.agora.pretetgo.enums.ReservationStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Instant startDate;

    private Instant endDate;

    @ManyToOne
    @JoinColumn(name = "reserved_by_id")
    private ReservationGroup reservedBy;

    @ManyToOne
    @JoinColumn(name = "resource_id")
    private Resource resource;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    private Instant validationDate;

    @CreationTimestamp
    private Instant createdAt;
}
