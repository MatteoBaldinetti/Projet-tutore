package com.agora.pretetgo.dto.filter;

import com.agora.pretetgo.enums.ReservationStatus;

import java.time.Instant;

public record ReservationFilterDTO(
        Long id,
        Instant startDate,
        Instant endDate,
        Long reservedById,
        Long resourceId,
        ReservationStatus status,
        Instant validationDate,
        Instant createdAt,
        Instant createdFrom,
        Instant createdTo
) {
}
