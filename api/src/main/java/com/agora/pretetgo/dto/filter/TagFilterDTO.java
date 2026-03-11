package com.agora.pretetgo.dto.filter;

import io.swagger.v3.oas.annotations.Parameter;

import java.time.Instant;
import java.util.Set;

public record TagFilterDTO(
        @Parameter(description = "Item type ID") Long id,
        @Parameter(description = "Item type name") String name,
        @Parameter(description = "ID of the professor who created this type") Long createdById,
        @Parameter(description = "IDs of the resources having this tag") Set<Long> resourceIds,
        @Parameter(description = "Exact creation timestamp") Instant createdAt,
        @Parameter(description = "Created after this timestamp") Instant createdFrom,
        @Parameter(description = "Created before this timestamp") Instant createdTo
) {}