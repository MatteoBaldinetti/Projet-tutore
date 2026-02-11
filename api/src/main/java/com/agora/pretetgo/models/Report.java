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

    @CreationTimestamp
    private Instant createdAt;

    public Report(String description, Resource resource, User reportedBy, ReportStatus status, Instant createdAt) {
        this.description = description;
        this.resource = resource;
        this.reportedBy = reportedBy;
        this.status = status;
        this.createdAt = createdAt;
    }

}
