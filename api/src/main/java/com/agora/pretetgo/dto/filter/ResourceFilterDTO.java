package com.agora.pretetgo.dto.filter;

import io.swagger.v3.oas.annotations.Parameter;

import java.time.Instant;

public record ResourceFilterDTO(
        @Parameter(description = "Resource ID") Long id,
        @Parameter(description = "Resource name") String name,
        @Parameter(description = "Resource description") String description,
        @Parameter(description = "ID of the professor managing this resource") Long managedById,
        @Parameter(description = "Is the resource available?") Boolean available,
        @Parameter(description = "Exact creation timestamp") Instant createdAt,
        @Parameter(description = "Created after this timestamp") Instant createdFrom,
        @Parameter(description = "Created before this timestamp") Instant createdTo
) {}