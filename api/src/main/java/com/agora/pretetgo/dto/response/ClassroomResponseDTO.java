package com.agora.pretetgo.dto.response;

import java.time.Instant;

public record ClassroomResponseDTO(
        Long id,
        String name,
        String description,
        Long managedById,
        Boolean available,
        Instant createdAt,
        Integer roomNumber
) implements ResourceResponseDTO {
}
