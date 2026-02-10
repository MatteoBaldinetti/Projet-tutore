package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record ResourceDTO(
        String name,
        String description,
        Long managedById,
        Boolean available,
        Instant createdAt
) {
}
