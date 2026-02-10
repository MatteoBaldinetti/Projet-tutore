package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record FileMetaDataDTO(
        String filename,
        Instant uploadedAt,
        String uri
) {
}
