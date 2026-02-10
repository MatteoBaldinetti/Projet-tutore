package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record ItemDTO(
        String name,
        String description,
        Long managedById,
        Boolean available,
        Instant createdAt,
        Integer serialNumber,
        Long typeId
) {
}
