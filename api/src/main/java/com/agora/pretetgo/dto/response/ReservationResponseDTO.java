package com.agora.pretetgo.dto.response;

import com.agora.pretetgo.enums.ReservationStatus;

import java.time.Instant;

public record ReservationResponseDTO(
        Long id,
        Instant startDate,
        Instant endDate,
        Long reservedById,
        Long resourceId,
        ReservationStatus status,
        Instant validationDate,
        Instant createdAt
) {
}
