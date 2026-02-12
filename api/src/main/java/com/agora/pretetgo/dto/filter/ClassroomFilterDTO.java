package com.agora.pretetgo.dto.filter;

import java.time.Instant;

public record ClassroomFilterDTO(
        Long id,
        String name,
        String description,
        Long managedById,
        Boolean available,
        Instant createdAt,
        Integer roomNumber,
        Instant createdFrom,
        Instant createdTo

) {
}
