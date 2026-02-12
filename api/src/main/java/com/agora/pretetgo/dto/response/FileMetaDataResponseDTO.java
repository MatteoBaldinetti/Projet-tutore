package com.agora.pretetgo.dto.response;

import java.time.Instant;

public record FileMetaDataResponseDTO(
        Long id,
        String filename,
        Instant uploadedAt,
        String url
) {
}
