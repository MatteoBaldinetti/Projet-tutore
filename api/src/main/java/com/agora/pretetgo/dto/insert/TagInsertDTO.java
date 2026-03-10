package com.agora.pretetgo.dto.insert;

import java.time.Instant;
import java.util.Set;

public record TagInsertDTO(
        String name,
        Long createdById,
        Set<Long> resourceIds,
        Instant createdAt
) {
}
