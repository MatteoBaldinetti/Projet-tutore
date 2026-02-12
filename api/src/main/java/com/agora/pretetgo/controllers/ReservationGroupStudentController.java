package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.filter.ReservationGroupStudentFilterDTO;
import com.agora.pretetgo.dto.response.ReservationGroupStudentResponseDTO;
import com.agora.pretetgo.dto.insert.ReservationGroupStudentInsertDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.ReservationGroupStudentMapper;
import com.agora.pretetgo.models.ReservationGroupStudent;
import com.agora.pretetgo.services.ReservationGroupStudentService;
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
@RequestMapping("/api/reservationGroupStudents")
@CrossOrigin(origins = "*")
@Tag(name = "ReservationGroupStudent", description = "Endpoints for managing reservationGroupStudents")
public class ReservationGroupStudentController {
    @Autowired
    private ReservationGroupStudentService reservationGroupStudentService;

    @Autowired
    private ReservationGroupStudentMapper reservationGroupStudentMapper;

    @Operation(summary = "Create a new reservationGroupStudent")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "ReservationGroupStudent created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create reservationGroupStudent", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<ReservationGroupStudentResponseDTO> createReservationGroupStudent(@RequestBody ReservationGroupStudentInsertDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservationGroupStudentMapper.toResponseDTO(reservationGroupStudentService.createReservationGroupStudent(dto)));
    }

    @Operation(summary = "Get reservationGroupStudent by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "ReservationGroupStudent retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "ReservationGroupStudent not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ReservationGroupStudentResponseDTO> getReservationGroupStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(
                reservationGroupStudentMapper.toResponseDTO(reservationGroupStudentService.getReservationGroupStudentById(id))
        );
    }

    @Operation(summary = "Get all reservationGroupStudents")
    @ApiResponse(responseCode = "200", description = "List of reservationGroupStudents retrieved successfully")
    @GetMapping
    public ResponseEntity<List<ReservationGroupStudentResponseDTO>> getAllReservationGroupStudents() {
        return ResponseEntity.ok(
                reservationGroupStudentService.getAllReservationGroupStudents().stream().map(reservationGroupStudentMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Update reservationGroupStudent")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "ReservationGroupStudent updated successfully"),
            @ApiResponse(responseCode = "404", description = "ReservationGroupStudent not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ReservationGroupStudentResponseDTO> updateReservationGroupStudent(@RequestBody ReservationGroupStudentInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                reservationGroupStudentMapper.toResponseDTO(reservationGroupStudentService.updateReservationGroupStudent(id, dto))
        );
    }

    @Operation(summary = "Delete reservationGroupStudent by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "ReservationGroupStudent deleted successfully"),
            @ApiResponse(responseCode = "404", description = "ReservationGroupStudent not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservationGroupStudent(@PathVariable Long id) {
        reservationGroupStudentService.deleteReservationGroupStudent(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch reservationGroupStudent")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "ReservationGroupStudent patched successfully"),
            @ApiResponse(responseCode = "404", description = "ReservationGroupStudent not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<ReservationGroupStudent> patchReservationGroupStudent(@RequestBody ReservationGroupStudentInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                reservationGroupStudentService.patchReservationGroupStudent(id, dto)
        );
    }

    @Operation(summary = "Search reservationGroupStudents with filters")
    @ApiResponse(responseCode = "200", description = "List of reservationGroupStudents retrieved successfully")
    @GetMapping("/search")
    public ResponseEntity<List<ReservationGroupStudentResponseDTO>> searchReservationGroupStudents(ReservationGroupStudentFilterDTO filterDTO) {
        return ResponseEntity.ok(
                reservationGroupStudentService.searchReservationGroupStudents(filterDTO)
        );
    }
}
