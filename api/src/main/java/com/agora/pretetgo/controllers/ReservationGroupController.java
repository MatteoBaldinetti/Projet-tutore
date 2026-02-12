package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.filter.ReservationGroupFilterDTO;
import com.agora.pretetgo.dto.response.ReservationGroupResponseDTO;
import com.agora.pretetgo.dto.insert.ReservationGroupInsertDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.ReservationGroupMapper;
import com.agora.pretetgo.services.ReservationGroupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservationGroups")
@CrossOrigin(origins = "*")
@Tag(name = "ReservationGroup", description = "Endpoints for managing reservationGroups")
public class ReservationGroupController {
    @Autowired
    private ReservationGroupService reservationGroupService;

    @Autowired
    private ReservationGroupMapper reservationGroupMapper;

    @Operation(summary = "Create a new reservationGroup")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "ReservationGroup created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create reservationGroup", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<ReservationGroupResponseDTO> createReservationGroup(@RequestBody ReservationGroupInsertDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservationGroupMapper.toResponseDTO(reservationGroupService.createReservationGroup(dto)));
    }

    @Operation(summary = "Get reservationGroup by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "ReservationGroup retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "ReservationGroup not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ReservationGroupResponseDTO> getReservationGroupById(@PathVariable Long id) {
        return ResponseEntity.ok(
                reservationGroupMapper.toResponseDTO(reservationGroupService.getReservationGroupById(id))
        );
    }

    @Operation(summary = "Get all reservationGroups")
    @ApiResponse(responseCode = "200", description = "List of reservationGroups retrieved successfully")
    @GetMapping
    public ResponseEntity<List<ReservationGroupResponseDTO>> getAllReservationGroups() {
        return ResponseEntity.ok(
                reservationGroupService.getAllReservationGroups().stream().map(reservationGroupMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Update reservationGroup")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "ReservationGroup updated successfully"),
            @ApiResponse(responseCode = "404", description = "ReservationGroup not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ReservationGroupResponseDTO> updateReservationGroup(@RequestBody ReservationGroupInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                reservationGroupMapper.toResponseDTO(reservationGroupService.updateReservationGroup(id, dto))
        );
    }

    @Operation(summary = "Delete reservationGroup by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "ReservationGroup deleted successfully"),
            @ApiResponse(responseCode = "404", description = "ReservationGroup not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservationGroup(@PathVariable Long id) {
        reservationGroupService.deleteReservationGroup(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch reservationGroup")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "ReservationGroup patched successfully"),
            @ApiResponse(responseCode = "404", description = "ReservationGroup not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<ReservationGroupResponseDTO> patchReservationGroup(@RequestBody ReservationGroupInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                reservationGroupMapper.toResponseDTO(reservationGroupService.patchReservationGroup(id, dto))
        );
    }

    @Operation(summary = "Search reservationGroups with filters")
    @ApiResponse(responseCode = "200", description = "List of reservationGroups retrieved successfully")
    @GetMapping("/search")
    public ResponseEntity<List<ReservationGroupResponseDTO>> searchReservationGroups(@ParameterObject @ModelAttribute ReservationGroupFilterDTO filterDTO) {
        return ResponseEntity.ok(
                reservationGroupService.searchReservationGroups(filterDTO)
        );
    }
}
