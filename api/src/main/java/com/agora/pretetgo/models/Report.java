package com.agora.pretetgo.models;

import com.agora.pretetgo.enums.ReportStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Data
@NoArgsConstructor
@Entity
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @ManyToOne
    @JoinColumn(name = "resource_id")
    private Resource resource;

    @ManyToOne
    @JoinColumn(name = "reported_by_id")
    private User reportedBy;

    @Enumerated(EnumType.STRING)
    private ReportStatus status;

    @ManyToOne
    @JoinColumn(name = "image_id")
    private FileMetaData image;

    @CreationTimestamp
    private Instant createdAt;

    public Report(Long id, String description, Resource resource, User reportedBy, ReportStatus status, FileMetaData image, Instant createdAt) {
        this.id = id;
        this.description = description;
        this.resource = resource;
        this.reportedBy = reportedBy;
        this.status = status;
        this.image = image;
        this.createdAt = createdAt;
    }
}
