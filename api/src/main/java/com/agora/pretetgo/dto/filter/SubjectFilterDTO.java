package com.agora.pretetgo.dto.filter;

import java.util.Set;

public record SubjectFilterDTO(
        Long id,
        String name,
        String description,
        Set<Long> professorIds
) {
}
