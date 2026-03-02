package com.agora.pretetgo.dto.insert;

import java.time.Instant;
import java.util.Set;

public record ItemInsertDTO(
        String name,
        String description,
        Set<Long> managedByIds,
        Boolean available,
        Long imageId,
        Long model3dId,
        Integer serialNumber,
        Long itemTypeId,
        Long usagePdfId,
        Instant createdAt
) {
}
