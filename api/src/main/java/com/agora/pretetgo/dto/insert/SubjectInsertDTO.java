package com.agora.pretetgo.dto.insert;

import java.util.Set;

public record SubjectInsertDTO(
        String name,
        String description,
        Set<Long> professorIds
) {
}
