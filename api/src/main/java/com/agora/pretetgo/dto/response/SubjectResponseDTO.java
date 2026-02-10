package com.agora.pretetgo.dto.response;

import java.util.Set;

public record SubjectResponseDTO(
        Long id,
        String name,
        String description,
        Set<Long> professorIds
) {
}
