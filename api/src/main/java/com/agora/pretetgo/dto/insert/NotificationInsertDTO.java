package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record NotificationInsertDTO(
        String message,
        Long imageId,
        Instant createdAt
) {
}
