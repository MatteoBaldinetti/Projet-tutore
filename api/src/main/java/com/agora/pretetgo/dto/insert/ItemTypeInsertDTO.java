package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record ItemTypeInsertDTO(
        String name,
        Long createdById,
        Instant createdAt
) {
}
