package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record StudentInsertDTO(
        String firstName,
        String lastName,
        String email,
        String password,
        Boolean enabled,
        Integer studentNumber,
        Instant createdAt
) {
}
