package com.agora.pretetgo.dto.response;

import java.time.Instant;

public record ItemResponseDTO(
        Long id,
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
) implements ResourceResponseDTO {
}
