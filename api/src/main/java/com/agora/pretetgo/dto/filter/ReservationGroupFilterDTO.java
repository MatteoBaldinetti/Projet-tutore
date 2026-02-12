package com.agora.pretetgo.dto.filter;

import java.time.Instant;

public record ReservationGroupFilterDTO(
        Long id,
        String name,
        Instant createdAt,
        Instant createdFrom,
        Instant createdTo
) {
}
