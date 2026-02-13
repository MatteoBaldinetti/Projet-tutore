package com.agora.pretetgo.dto.response;

import com.agora.pretetgo.enums.GroupRole;

import java.time.Instant;

public record ReservationGroupStudentResponseDTO(
        Long id,
        Long reservationGroupId,
        Long studentId,
        GroupRole role,
        Instant createdAt
) {
}
