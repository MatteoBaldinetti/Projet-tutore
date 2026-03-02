package com.agora.pretetgo.dto.response;

import java.time.Instant;
import java.util.Set;

public record ClassroomResponseDTO(
        Long id,
        String name,
        String description,
        Set<Long> managedByIds,
        Boolean available,
        Long imageId,
        Long model3dId,
        Integer roomNumber,
        Long classroomTypeId,
        Instant createdAt
) implements ResourceResponseDTO {
}
