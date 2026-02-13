package com.agora.pretetgo.dto.response;

import java.time.Instant;

public record ReservationGroupResponseDTO(
        Long id,
        String name,
        Instant createdAt
) {
}
