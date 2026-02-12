package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.filter.ReservationFilterDTO;
import com.agora.pretetgo.dto.insert.ReservationInsertDTO;
import com.agora.pretetgo.dto.response.ReservationResponseDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.ReservationMapper;
import com.agora.pretetgo.models.Reservation;
import com.agora.pretetgo.services.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
@Tag(name = "Reservation", description = "Endpoints for managing reservations")
public class ReservationController {
    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ReservationMapper reservationMapper;

    @Operation(summary = "Create a new reservation")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Reservation created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create reservation", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<ReservationResponseDTO> createReservation(@RequestBody ReservationInsertDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservationMapper.toResponseDTO(reservationService.createReservation(dto)));
    }

    @Operation(summary = "Get reservation by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reservation retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Reservation not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponseDTO> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(
                reservationMapper.toResponseDTO(reservationService.getReservationById(id))
        );
    }

    @Operation(summary = "Get all reservations")
    @ApiResponse(responseCode = "200", description = "List of reservations retrieved successfully")
    @GetMapping
    public ResponseEntity<List<ReservationResponseDTO>> getAllReservations() {
        return ResponseEntity.ok(
                reservationService.getAllReservations().stream().map(reservationMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Update reservation")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reservation updated successfully"),
            @ApiResponse(responseCode = "404", description = "Reservation not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ReservationResponseDTO> updateReservation(@RequestBody ReservationInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                reservationMapper.toResponseDTO(reservationService.updateReservation(id, dto))
        );
    }

    @Operation(summary = "Delete reservation by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Reservation deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Reservation not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch reservation")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reservation patched successfully"),
            @ApiResponse(responseCode = "404", description = "Reservation not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<Reservation> patchReservation(@RequestBody ReservationInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                reservationService.patchReservation(id, dto)
        );
    }

    @Operation(summary = "Search reservations with filters")
    @ApiResponse(responseCode = "200", description = "List of reservations retrieved successfully")
    @GetMapping("/search")
    public ResponseEntity<List<ReservationResponseDTO>> searchReservations(ReservationFilterDTO filterDTO) {
        return ResponseEntity.ok(
                reservationService.searchReservations(filterDTO)
        );
    }
}
