package com.agora.pretetgo.dto.insert;

import java.time.Instant;
import java.util.Set;

public record ProfessorDTO(
        String firstName,
        String lastName,
        String email,
        String password,
        Instant createdAt,
        Boolean enabled,
        Set<Long> subjectIds
) {
}
