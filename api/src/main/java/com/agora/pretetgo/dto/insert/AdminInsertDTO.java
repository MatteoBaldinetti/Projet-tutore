package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record AdminInsertDTO(
        String firstName,
        String lastName,
        String email,
        String password,
        Instant createdAt,
        Boolean enabled
) {
}
