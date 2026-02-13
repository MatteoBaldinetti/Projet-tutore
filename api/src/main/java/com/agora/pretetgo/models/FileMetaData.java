package com.agora.pretetgo.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Data
@NoArgsConstructor
@Entity
public class FileMetaData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;

    @CreationTimestamp
    private Instant uploadedAt;

    private String url;

    public FileMetaData(String filename, Instant uploadedAt, String url) {
        this.filename = filename;
        this.uploadedAt = uploadedAt;
        this.url = url;
    }

}
