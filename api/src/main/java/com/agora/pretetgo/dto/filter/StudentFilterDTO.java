package com.agora.pretetgo.dto.filter;

import java.time.Instant;

public record StudentFilterDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        String password,
        Instant createdAt,
        Boolean enabled,
        Integer studentNumber,
        Instant createdFrom,
        Instant createdTo
) {
}
