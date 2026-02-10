package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record NotificationDTO(
        String message,
        Instant createdAt
) {
}
