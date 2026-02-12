package com.agora.pretetgo.dto.filter;

import java.time.Instant;

public record AdminFilterDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        String password,
        Instant createdAt,
        Boolean enabled,
        Instant createdFrom,
        Instant createdTo
) {
}
