package com.agora.pretetgo.dto.filter;

import io.swagger.v3.oas.annotations.Parameter;

import java.util.Set;

public record SubjectFilterDTO(
        @Parameter(description = "Subject ID") Long id,
        @Parameter(description = "Subject name") String name,
        @Parameter(description = "Subject description") String description,
        @Parameter(description = "IDs of professors teaching this subject") Set<Long> professorIds
) {}