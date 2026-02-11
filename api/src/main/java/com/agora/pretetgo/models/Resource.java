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
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "resource_type")
public abstract class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    protected String name;

    protected String description;

    @ManyToOne
    @JoinColumn(name = "managed_by_id")
    protected Professor managedBy;

    protected Boolean available = true;

    @CreationTimestamp
    protected Instant createdAt;

    @OneToMany(mappedBy = "resource")
    protected List<Reservation> reservations = new ArrayList<>();

    @OneToMany(mappedBy = "resource")
    protected List<Report> reports = new ArrayList<>();

    public Resource(String name, String description, Professor managedBy, Boolean available, Instant createdAt) {
        this.name = name;
        this.description = description;
        this.managedBy = managedBy;
        this.available = available;
        this.createdAt = createdAt;
    }

}
