package com.agora.pretetgo.dto.filter;

import com.agora.pretetgo.enums.ReportStatus;
import io.swagger.v3.oas.annotations.Parameter;

import java.time.Instant;

public record ReportFilterDTO(
        @Parameter(description = "Report ID") Long id,
        @Parameter(description = "Report description") String description,
        @Parameter(description = "ID of the resource being reported") Long resourceId,
        @Parameter(description = "ID of the user who reported") Long reportedById,
        @Parameter(description = "Status of the report") ReportStatus status,
        @Parameter(description = "ID of the image file") Long imageId,
        @Parameter(description = "Exact creation timestamp") Instant createdAt,
        @Parameter(description = "Created after this timestamp") Instant createdFrom,
        @Parameter(description = "Created before this timestamp") Instant createdTo
) {}