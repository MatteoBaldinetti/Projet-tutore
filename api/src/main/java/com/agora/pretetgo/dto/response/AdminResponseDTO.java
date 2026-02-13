package com.agora.pretetgo.dto.response;

import java.time.Instant;

public record AdminResponseDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        String password,
        Boolean enabled,
        Instant createdAt
) implements UserResponseDTO {
}
