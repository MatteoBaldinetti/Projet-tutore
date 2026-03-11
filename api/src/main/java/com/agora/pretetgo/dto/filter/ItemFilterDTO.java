package com.agora.pretetgo.dto.filter;

import io.swagger.v3.oas.annotations.Parameter;

import java.time.Instant;
import java.util.Set;

public record ItemFilterDTO(
        @Parameter(description = "Item ID") Long id,
        @Parameter(description = "Item name") String name,
        @Parameter(description = "Item description") String description,
        @Parameter(description = "IDs of the professors managing this item") Set<Long> managedByIds,
        @Parameter(description = "Is the item available?") Boolean available,
        @Parameter(description = "IDs of the image files") Set<Long> imageIds,
        @Parameter(description = "ID of the 3D model file") Long model3dId,
        @Parameter(description = "IDs of the tags") Set<Long> tagIds,
        @Parameter(description = "Serial number of the item") Integer serialNumber,
        @Parameter(description = "ID of the item type") Long itemTypeId,
        @Parameter(description = "ID of the usage PDF file") Long usagePdfId,
        @Parameter(description = "Exact creation at timestamp") Instant createdAt,
        @Parameter(description = "Created after this timestamp") Instant createdFrom,
        @Parameter(description = "Created before this timestamp") Instant createdTo
) {}