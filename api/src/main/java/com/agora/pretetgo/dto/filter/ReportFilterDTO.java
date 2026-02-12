package com.agora.pretetgo.dto.filter;

import com.agora.pretetgo.enums.ReportStatus;

import java.time.Instant;

public record ReportFilterDTO(
        Long id,
        String description,
        Long resourceId,
        Long reportedById,
        ReportStatus status,
        Instant createdAt,
        Instant createdFrom,
        Instant createdTo
) {
}
