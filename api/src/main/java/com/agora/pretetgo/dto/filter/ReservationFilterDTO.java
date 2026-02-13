package com.agora.pretetgo.dto.filter;

import com.agora.pretetgo.enums.ReservationStatus;
import io.swagger.v3.oas.annotations.Parameter;

import java.time.Instant;

public record ReservationFilterDTO(
        @Parameter(description = "Reservation ID") Long id,
        @Parameter(description = "Start date of the reservation") Instant startDate,
        @Parameter(description = "End date of the reservation") Instant endDate,
        @Parameter(description = "ID of the reservation group who reserved") Long reservedById,
        @Parameter(description = "ID of the reserved resource") Long resourceId,
        @Parameter(description = "Status of the reservation") ReservationStatus status,
        @Parameter(description = "Validation timestamp of the reservation") Instant validationDate,
        @Parameter(description = "Exact creation timestamp") Instant createdAt,
        @Parameter(description = "Created after this timestamp") Instant createdFrom,
        @Parameter(description = "Created before this timestamp") Instant createdTo
) {}