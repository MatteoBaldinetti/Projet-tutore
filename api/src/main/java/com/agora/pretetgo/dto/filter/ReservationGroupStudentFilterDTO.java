package com.agora.pretetgo.dto.filter;

import com.agora.pretetgo.enums.GroupRole;
import io.swagger.v3.oas.annotations.Parameter;

import java.time.Instant;

public record ReservationGroupStudentFilterDTO(
        @Parameter(description = "ID") Long id,
        @Parameter(description = "Reservation group ID") Long reservationGroupId,
        @Parameter(description = "Student ID") Long studentId,
        @Parameter(description = "Role of the student in the group") GroupRole role,
        @Parameter(description = "Exact creation timestamp") Instant createdAt,
        @Parameter(description = "Created after this timestamp") Instant createdFrom,
        @Parameter(description = "Created before this timestamp") Instant createdTo
) {}