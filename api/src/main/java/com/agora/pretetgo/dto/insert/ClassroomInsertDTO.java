package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record ClassroomInsertDTO(
        String name,
        String description,
        Long managedById,
        Boolean available,
        Long imageId,
        Long model3dId,
        Integer roomNumber,
        Instant createdAt
) {
}
