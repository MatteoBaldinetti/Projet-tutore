package com.agora.pretetgo.dto.filter;

import java.time.Instant;
import java.util.Set;

public record ProfessorFilterDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        String password,
        Instant createdAt,
        Boolean enabled,
        Set<Long> subjectIds,
        Instant createdFrom,
        Instant createdTo
) {
}
