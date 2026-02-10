package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record ReservationGroupDTO(
        String name,
        Instant createdAt
) {
}
