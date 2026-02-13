package com.agora.pretetgo.dto.filter;

import io.swagger.v3.oas.annotations.Parameter;

import java.time.Instant;

public record ClassroomFilterDTO(
        @Parameter(description = "Classroom ID") Long id,
        @Parameter(description = "Classroom name") String name,
        @Parameter(description = "Classroom description") String description,
        @Parameter(description = "ID of the professor managing this classroom") Long managedById,
        @Parameter(description = "Is the classroom available?") Boolean available,
        @Parameter(description = "ID of the image file") Long imageId,
        @Parameter(description = "ID of the 3D model file") Long model3dId,
        @Parameter(description = "Room number") Integer roomNumber,
        @Parameter(description = "Exact creation timestamp") Instant createdAt,
        @Parameter(description = "Created after this timestamp") Instant createdFrom,
        @Parameter(description = "Created before this timestamp") Instant createdTo
) {}