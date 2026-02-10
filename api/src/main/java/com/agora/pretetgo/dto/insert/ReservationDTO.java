package com.agora.pretetgo.dto.insert;

import com.agora.pretetgo.enums.ReservationStatus;

import java.time.Instant;

public record ReservationDTO(
        Instant startDate,
        Instant endDate,
        Long reservedById,
        Long resourceId,
        ReservationStatus status,
        Instant validationDate,
        Instant createdAt
) {
}
