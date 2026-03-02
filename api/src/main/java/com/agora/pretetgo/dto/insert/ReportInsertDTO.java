package com.agora.pretetgo.dto.insert;

import com.agora.pretetgo.enums.ReportStatus;

import java.time.Instant;

public record ReportInsertDTO(
        String description,
        Long resourceId,
        Long reportedById,
        ReportStatus status,
        Long imageId,
        Instant createdAt
) {
}
