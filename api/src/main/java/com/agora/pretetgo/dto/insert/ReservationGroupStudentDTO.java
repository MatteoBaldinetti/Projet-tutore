package com.agora.pretetgo.dto.insert;

import com.agora.pretetgo.enums.GroupRole;

import java.time.Instant;

public record ReservationGroupStudentDTO(
        Long reservationGroupId,
        Long studentId,
        GroupRole role,
        Instant createdAt
) {
}
