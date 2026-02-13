package com.agora.pretetgo.dto.filter;

import io.swagger.v3.oas.annotations.Parameter;

import java.time.Instant;

public record ItemFilterDTO(
        @Parameter(description = "Item ID") Long id,
        @Parameter(description = "Item name") String name,
        @Parameter(description = "Item description") String description,
        @Parameter(description = "ID of the professor managing this item") Long managedById,
        @Parameter(description = "Is the item available?") Boolean available,
        @Parameter(description = "Exact creation at timestamp") Instant createdAt,
        @Parameter(description = "Serial number of the item") Integer serialNumber,
        @Parameter(description = "Type ID of the item") Long typeId,
        @Parameter(description = "Created after this timestamp") Instant createdFrom,
        @Parameter(description = "Created before this timestamp") Instant createdTo
) {}