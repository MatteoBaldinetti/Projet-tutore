package com.agora.pretetgo.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.Set;

@Data
@NoArgsConstructor
@Entity
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @EqualsAndHashCode.Exclude
    @ManyToMany(mappedBy = "tags")
    private Set<Resource> resources;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private Professor createdBy;

    @CreationTimestamp
    private Instant createdAt;

    public Tag(String name, Set<Resource> resources, Professor createdBy, Instant createdAt) {
        this.name = name;
        this.resources = resources;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }
}