package com.agora.pretetgo.dto.response;

import java.time.Instant;

public record NotificationResponseDTO(
        Long id,
        String message,
        Instant createdAt
) {
}
