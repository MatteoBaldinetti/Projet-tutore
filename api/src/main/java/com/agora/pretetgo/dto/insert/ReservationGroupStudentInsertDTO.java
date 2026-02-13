package com.agora.pretetgo.dto.insert;

import com.agora.pretetgo.enums.GroupRole;

import java.time.Instant;

public record ReservationGroupStudentInsertDTO(
        Long reservationGroupId,
        Long studentId,
        GroupRole role,
        Instant createdAt
) {
}
