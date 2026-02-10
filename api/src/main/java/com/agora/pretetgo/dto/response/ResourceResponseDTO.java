package com.agora.pretetgo.dto.response;

import java.time.Instant;

public record ResourceResponseDTO(
        Long id,
        String name,
        String description,
        Long managedById,
        Boolean available,
        Instant createdAt
) {
}
