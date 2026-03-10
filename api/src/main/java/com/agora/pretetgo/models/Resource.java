package com.agora.pretetgo.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

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

    @EqualsAndHashCode.Exclude
    @ManyToMany(mappedBy = "resources")
    protected Set<Professor> managedBy;

    protected Boolean available = true;

    @EqualsAndHashCode.Exclude
    @ManyToMany
    @JoinTable(
            name = "resource_image",
            joinColumns = @JoinColumn(name = "resource_id"),
            inverseJoinColumns = @JoinColumn(name = "file_meta_data_id")
    )
    protected Set<FileMetaData> images;

    @ManyToOne
    @JoinColumn(name = "model_3d_id")
    protected FileMetaData model3d;

    @EqualsAndHashCode.Exclude
    @ManyToMany
    @JoinTable(
            name = "resource_tag",
            joinColumns = @JoinColumn(name = "resource_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    protected Set<Tag> tags;

    @CreationTimestamp
    protected Instant createdAt;

    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "resource")
    protected List<Reservation> reservations = new ArrayList<>();

    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "resource")
    protected List<Report> reports = new ArrayList<>();

    public Resource(String name, String description, Set<Professor> managedBy, Boolean available, Set<FileMetaData> images, FileMetaData model3d, Set<Tag> tags, Instant createdAt) {
        this.name = name;
        this.description = description;
        this.managedBy = managedBy;
        this.available = available;
        this.images = images;
        this.model3d = model3d;
        this.tags = tags;
        this.createdAt = createdAt;
    }
}
