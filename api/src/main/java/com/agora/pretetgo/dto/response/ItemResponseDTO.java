package com.agora.pretetgo.dto.response;

import java.time.Instant;
import java.util.Set;

public record ItemResponseDTO(
        Long id,
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
) implements ResourceResponseDTO {
}
