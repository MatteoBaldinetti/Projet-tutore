package com.agora.pretetgo.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Set;

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

    public Classroom(String name, String description, Set<Professor> managedBy, Boolean available, Set<FileMetaData> images, FileMetaData model3d, Instant createdAt, Integer roomNumber, ClassroomType classroomType) {
        super(name, description, managedBy, available, images, model3d, createdAt);
        this.roomNumber = roomNumber;
        this.classroomType = classroomType;
    }
}
