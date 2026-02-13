package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record NotificationInsertDTO(
        String message,
        Instant createdAt
) {
}
