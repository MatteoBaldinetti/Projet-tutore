package com.agora.pretetgo.dto.response;

import java.time.Instant;

public record ClassroomTypeResponseDTO(
        Long id,
        String name,
        Long createdById,
        Instant createdAt
) {
}
