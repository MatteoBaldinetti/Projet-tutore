package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record ClassroomInsertDTO(
        String name,
        String description,
        Long managedById,
        Boolean available,
        Instant createdAt,
        Integer roomNumber
) {
}
