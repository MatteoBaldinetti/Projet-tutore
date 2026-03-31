package com.agora.pretetgo.dto.filter;

import io.swagger.v3.oas.annotations.Parameter;

import java.time.Instant;

public record SecurityAgentFilterDTO(
        @Parameter(description = "Agent ID") Long id,
        @Parameter(description = "First name") String firstName,
        @Parameter(description = "Last name") String lastName,
        @Parameter(description = "Email address") String email,
        @Parameter(description = "Password") String password,
        @Parameter(description = "Is the agent enabled?") Boolean enabled,
        @Parameter(description = "Created at exact timestamp") Instant createdAt,
        @Parameter(description = "Created after this timestamp") Instant createdFrom,
        @Parameter(description = "Created before this timestamp") Instant createdTo
) {
}
