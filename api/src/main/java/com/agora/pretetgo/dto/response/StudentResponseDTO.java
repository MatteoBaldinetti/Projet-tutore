package com.agora.pretetgo.dto.response;

import java.time.Instant;

public record StudentResponseDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        String password,
        Boolean enabled,
        Integer studentNumber,
        Instant createdAt
) implements UserResponseDTO {
}
