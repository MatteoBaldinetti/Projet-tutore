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

    private Integer capacity;

    private Integer computers;

    public Classroom(String name, String description, Set<Professor> managedBy, Boolean available, Set<FileMetaData> images, FileMetaData model3d, Set<Tag> tags, Instant createdAt, Integer roomNumber, ClassroomType classroomType, Integer capacity, Integer computers) {
        super(name, description, managedBy, available, images, model3d, tags, createdAt);
        this.roomNumber = roomNumber;
        this.classroomType = classroomType;
        this.capacity = capacity;
        this.computers = computers;
    }
}
