package com.agora.pretetgo.dto.insert;

import java.util.Set;

public record SubjectDTO(
        String name,
        String description,
        Set<Long> professorIds
) {
}
