package com.agora.pretetgo.dto.filter;

import java.time.Instant;

public record ResourceFilterDTO(
        Long id,
        String name,
        String description,
        Long managedById,
        Boolean available,
        Instant createdAt,
        Instant createdFrom,
        Instant createdTo
) {
}
