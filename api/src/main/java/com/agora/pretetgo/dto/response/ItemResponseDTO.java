package com.agora.pretetgo.dto.response;

import java.time.Instant;

public record ItemResponseDTO(
        Long id,
        String name,
        String description,
        Long managedById,
        Boolean available,
        Instant createdAt,
        Integer serialNumber,
        Long typeId
) {
}
