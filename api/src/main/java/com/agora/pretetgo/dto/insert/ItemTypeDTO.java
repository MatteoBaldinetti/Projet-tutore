package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record ItemTypeDTO(
        String name,
        Long createdById,
        Instant createdAt
) {
}
