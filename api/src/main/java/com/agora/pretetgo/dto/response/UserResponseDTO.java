package com.agora.pretetgo.dto.response;

import java.time.Instant;

public record UserResponseDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        String password,
        Instant createdAt,
        Boolean enabled
) {
}
