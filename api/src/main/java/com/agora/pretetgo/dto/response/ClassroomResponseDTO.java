package com.agora.pretetgo.dto.response;

import java.time.Instant;

public record ClassroomResponseDTO(
        Long id,
        String name,
        String description,
        Long managedById,
        Boolean available,
        Long imageId,
        Long model3dId,
        Integer roomNumber,
        Long classroomTypeId,
        Instant createdAt
) implements ResourceResponseDTO {
}
