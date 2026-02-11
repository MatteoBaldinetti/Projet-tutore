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
public class ItemType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private Professor createdBy;

    @CreationTimestamp
    private Instant createdAt;

    @OneToMany(mappedBy = "type")
    private List<Item> item = new ArrayList<>();

    public ItemType(String name, Professor createdBy, Instant createdAt) {
        this.name = name;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

}
