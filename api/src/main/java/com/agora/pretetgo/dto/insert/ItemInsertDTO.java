package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record ItemInsertDTO(
        String name,
        String description,
        Long managedById,
        Boolean available,
        Long imageId,
        Long model3dId,
        Integer serialNumber,
        Long itemTypeId,
        Long usagePdfId,
        Instant createdAt
) {
}
