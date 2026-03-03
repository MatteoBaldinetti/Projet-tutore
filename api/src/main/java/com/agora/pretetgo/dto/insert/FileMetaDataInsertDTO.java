package com.agora.pretetgo.dto.insert;

import java.time.Instant;
import java.util.Set;

public record FileMetaDataInsertDTO(
        String filename,
        String url,
        Set<Long> resourcesImageIds,
        Instant uploadedAt
) {
}
