package com.agora.pretetgo.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

    @ManyToOne
    @JoinColumn(name = "classroom_type_id")
    private ClassroomType classroomType;

    public Classroom(String name, String description, Professor managedBy, Boolean available, FileMetaData image, FileMetaData model3d, Instant createdAt, Integer roomNumber) {
        super(name, description, managedBy, available, image, model3d, createdAt);
        this.roomNumber = roomNumber;
    }
}
