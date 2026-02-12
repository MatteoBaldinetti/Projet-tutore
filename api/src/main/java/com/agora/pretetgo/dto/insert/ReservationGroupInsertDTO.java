package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record ReservationGroupInsertDTO(
        String name,
        Instant createdAt
) {
}
