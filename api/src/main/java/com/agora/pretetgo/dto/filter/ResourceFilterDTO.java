package com.agora.pretetgo.dto.filter;

import io.swagger.v3.oas.annotations.Parameter;

import java.time.Instant;
import java.util.Set;

public record ResourceFilterDTO(
        @Parameter(description = "Resource ID") Long id,
        @Parameter(description = "Resource name") String name,
        @Parameter(description = "Resource description") String description,
        @Parameter(description = "IDs of the professors managing this resource") Set<Long> managedByIds,
        @Parameter(description = "Is the resource available?") Boolean available,
        @Parameter(description = "IDs of the image files") Set<Long> imageIds,
        @Parameter(description = "ID of the 3D model file") Long model3dId,
        @Parameter(description = "IDs of the tags") Set<Long> tagIds,
        @Parameter(description = "Exact creation timestamp") Instant createdAt,
        @Parameter(description = "Created after this timestamp") Instant createdFrom,
        @Parameter(description = "Created before this timestamp") Instant createdTo
) {}