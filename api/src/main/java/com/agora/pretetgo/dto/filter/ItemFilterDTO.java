package com.agora.pretetgo.dto.filter;

import java.time.Instant;

public record ItemFilterDTO(
        Long id,
        String name,
        String description,
        Long managedById,
        Boolean available,
        Instant createdAt,
        Integer serialNumber,
        Long typeId,
        Instant createdFrom,
        Instant createdTo
) {
}
