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

    public Reservation() {}

    public Reservation(Instant startDate, Instant endDate, ReservationGroup reservedBy, Resource resource, ReservationStatus status, Instant validationDate, Instant createdAt) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.reservedBy = reservedBy;
        this.resource = resource;
        this.status = status;
        this.validationDate = validationDate;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStartDate() {
        return startDate;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Instant getEndDate() {
        return endDate;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public ReservationGroup getReservedBy() {
        return reservedBy;
    }

    public void setReservedBy(ReservationGroup reservedBy) {
        this.reservedBy = reservedBy;
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }

    public Instant getValidationDate() {
        return validationDate;
    }

    public void setValidationDate(Instant validationDate) {
        this.validationDate = validationDate;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
