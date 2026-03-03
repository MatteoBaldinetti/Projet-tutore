package com.agora.pretetgo.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@Entity
public class FileMetaData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;

    private String url;

    @EqualsAndHashCode.Exclude
    @ManyToMany(mappedBy = "images")
    private Set<Resource> resourcesImages = new HashSet<>();

    @CreationTimestamp
    private Instant uploadedAt;

    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "image")
    private List<Notification> notifications = new ArrayList<>();

    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "image")
    private List<Report> reports = new ArrayList<>();

    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "model3d")
    private List<Resource> resourcesModel3D = new ArrayList<>();

    public FileMetaData(String filename, String url, Instant uploadedAt) {
        this.filename = filename;
        this.url = url;
        this.uploadedAt = uploadedAt;
    }
}
