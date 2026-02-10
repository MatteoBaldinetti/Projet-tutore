package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record AdminDTO(
        String firstName,
        String lastName,
        String email,
        String password,
        Instant createdAt,
        Boolean enabled
) {
}
