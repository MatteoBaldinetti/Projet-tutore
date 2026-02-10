package com.agora.pretetgo.models;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "resource_type")
public abstract class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    @ManyToOne
    @JoinColumn(name = "managed_by_id")
    private Professor managedBy;

    private Boolean available = true;

    @CreationTimestamp
    private Instant createdAt;

    @OneToMany(mappedBy = "resource")
    private List<Reservation> reservations = new ArrayList<>();

    @OneToMany(mappedBy = "resource")
    private List<Report> reports = new ArrayList<>();

    public Resource() {}

    public Resource(String name, String description, Professor managedBy, Boolean available, Instant createdAt) {
        this.name = name;
        this.description = description;
        this.managedBy = managedBy;
        this.available = available;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Professor getManagedBy() {
        return managedBy;
    }

    public void setManagedBy(Professor managedBy) {
        this.managedBy = managedBy;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }

    public List<Report> getReports() {
        return reports;
    }

    public void setReports(List<Report> reports) {
        this.reports = reports;
    }
}
