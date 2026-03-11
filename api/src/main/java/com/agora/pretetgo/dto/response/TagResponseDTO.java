package com.agora.pretetgo.dto.response;

import java.time.Instant;
import java.util.Set;

public record TagResponseDTO(
        Long id,
        String name,
        Long createdById,
        Set<Long> resourceIds,
        Instant createdAt
) {
}
