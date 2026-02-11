package com.agora.pretetgo.models;

import com.agora.pretetgo.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Data
@NoArgsConstructor
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

    public Reservation(Instant startDate, Instant endDate, ReservationGroup reservedBy, Resource resource, ReservationStatus status, Instant validationDate, Instant createdAt) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.reservedBy = reservedBy;
        this.resource = resource;
        this.status = status;
        this.validationDate = validationDate;
        this.createdAt = createdAt;
    }

}
