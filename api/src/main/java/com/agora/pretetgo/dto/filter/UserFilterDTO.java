package com.agora.pretetgo.dto.filter;

import io.swagger.v3.oas.annotations.Parameter;

import java.time.Instant;

public record UserFilterDTO(
        @Parameter(description = "User ID") Long id,
        @Parameter(description = "First name") String firstName,
        @Parameter(description = "Last name") String lastName,
        @Parameter(description = "Email address") String email,
        @Parameter(description = "Password") String password,
        @Parameter(description = "Is the user enabled?") Boolean enabled,
        @Parameter(description = "Exact creation timestamp") Instant createdAt,
        @Parameter(description = "Created after this timestamp") Instant createdFrom,
        @Parameter(description = "Created before this timestamp") Instant createdTo
) {}