package com.agora.pretetgo.dto.filter;

import io.swagger.v3.oas.annotations.Parameter;

import java.time.Instant;

public record FileMetaDataFilterDTO(
        @Parameter(description = "FileMetaData ID") Long id,
        @Parameter(description = "Filename") String filename,
        @Parameter(description = "File URL in the form of /api/*") String url,
        @Parameter(description = "Exact upload timestamp") Instant uploadedAt,
        @Parameter(description = "Created after this timestamp") Instant createdFrom,
        @Parameter(description = "Created before this timestamp") Instant createdTo
) {}