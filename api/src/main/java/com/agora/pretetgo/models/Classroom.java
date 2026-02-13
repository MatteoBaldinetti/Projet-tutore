package com.agora.pretetgo.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.Instant;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@Entity
@DiscriminatorValue("CLASSROOM")
public class Classroom extends Resource {
    private Integer roomNumber;

    public Classroom(String name, String description, Professor managedBy, Boolean available, Instant createdAt, Integer roomNumber) {
        super(name, description, managedBy, available, createdAt);
        this.roomNumber = roomNumber;
    }

}
