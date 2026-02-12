package com.agora.pretetgo.dto.filter;

import java.time.Instant;

public record NotificationFilterDTO(
        Long id,
        String message,
        Instant createdAt,
        Instant createdFrom,
        Instant createdTo
) {
}
