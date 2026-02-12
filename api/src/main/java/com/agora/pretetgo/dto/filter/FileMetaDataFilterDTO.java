package com.agora.pretetgo.dto.filter;

import java.time.Instant;

public record FileMetaDataFilterDTO(
        Long id,
        String filename,
        Instant uploadedAt,
        String url,
        Instant createdFrom,
        Instant createdTo
) {
}
