package com.agora.pretetgo.dto.filter;

import com.agora.pretetgo.enums.GroupRole;

import java.time.Instant;

public record ReservationGroupStudentFilterDTO(
        Long id,
        Long reservationGroupId,
        Long studentId,
        GroupRole role,
        Instant createdAt,
        Instant createdFrom,
        Instant createdTo
) {
}
