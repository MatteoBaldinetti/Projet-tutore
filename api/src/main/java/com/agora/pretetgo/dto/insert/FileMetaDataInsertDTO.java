package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record FileMetaDataInsertDTO(
        String filename,
        String url,
        Instant uploadedAt
) {
}
