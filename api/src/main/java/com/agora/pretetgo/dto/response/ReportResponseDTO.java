package com.agora.pretetgo.dto.response;

import com.agora.pretetgo.enums.ReportStatus;

import java.time.Instant;

public record ReportResponseDTO(
        Long id,
        String description,
        Long resourceId,
        Long reportedById,
        ReportStatus status,
        Instant createdAt
) {
}
