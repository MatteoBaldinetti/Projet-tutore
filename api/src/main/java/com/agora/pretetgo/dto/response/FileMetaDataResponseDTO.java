package com.agora.pretetgo.dto.response;

import java.time.Instant;
import java.util.Set;

public record FileMetaDataResponseDTO(
        Long id,
        String filename,
        String url,
        Set<Long> resourcesImageIds,
        Instant uploadedAt
) {
}
