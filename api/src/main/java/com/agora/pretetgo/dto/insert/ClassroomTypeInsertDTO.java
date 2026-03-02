package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record ClassroomTypeInsertDTO(
        String name,
        Long createdById,
        Instant createdAt
) {
}
