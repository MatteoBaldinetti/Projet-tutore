package com.agora.pretetgo.dto.filter;

import java.time.Instant;

public record ItemTypeFilterDTO(
        Long id,
        String name,
        Long createdById,
        Instant createdAt,
        Instant createdFrom,
        Instant createdTo
) {
}
