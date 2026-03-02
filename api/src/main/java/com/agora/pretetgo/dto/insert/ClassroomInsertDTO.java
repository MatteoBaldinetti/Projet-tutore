package com.agora.pretetgo.dto.insert;

import java.time.Instant;
import java.util.Set;

public record ClassroomInsertDTO(
        String name,
        String description,
        Set<Long> managedByIds,
        Boolean available,
        Long imageId,
        Long model3dId,
        Integer roomNumber,
        Long classroomTypeId,
        Instant createdAt
) {
}
