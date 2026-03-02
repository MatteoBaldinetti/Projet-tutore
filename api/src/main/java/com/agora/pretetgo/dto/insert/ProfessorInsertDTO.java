package com.agora.pretetgo.dto.insert;

import java.time.Instant;
import java.util.Set;

public record ProfessorInsertDTO(
        String firstName,
        String lastName,
        String email,
        String password,
        Boolean enabled,
        Set<Long> subjectIds,
        Set<Long> resourceIds,
        Instant createdAt
) {
}
