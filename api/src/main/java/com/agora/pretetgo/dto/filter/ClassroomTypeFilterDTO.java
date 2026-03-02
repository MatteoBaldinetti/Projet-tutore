package com.agora.pretetgo.dto.filter;

import io.swagger.v3.oas.annotations.Parameter;

import java.time.Instant;

public record ClassroomTypeFilterDTO(
        @Parameter(description = "Classroom type ID") Long id,
        @Parameter(description = "Classroom type name") String name,
        @Parameter(description = "ID of the professor who created this type") Long createdById,
        @Parameter(description = "Exact creation timestamp") Instant createdAt,
        @Parameter(description = "Created after this timestamp") Instant createdFrom,
        @Parameter(description = "Created before this timestamp") Instant createdTo
) {}