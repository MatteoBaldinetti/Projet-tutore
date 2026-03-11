package com.agora.pretetgo.dto.response;

import java.time.Instant;
import java.util.Set;

public record ProfessorResponseDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        String password,
        Boolean enabled,
        Set<Long> subjectIds,
        Set<Long> resourceIds,
        Instant createdAt
) implements UserResponseDTO {
}
