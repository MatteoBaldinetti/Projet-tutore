package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.filter.ProfessorFilterDTO;
import com.agora.pretetgo.dto.response.ProfessorResponseDTO;
import com.agora.pretetgo.dto.insert.ProfessorInsertDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.ProfessorMapper;
import com.agora.pretetgo.services.ProfessorService;
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
@RequestMapping("/api/professors")
@CrossOrigin(origins = "*")
@Tag(name = "Professor", description = "Endpoints for managing professors")
public class ProfessorController {
    @Autowired
    private ProfessorService professorService;

    @Autowired
    private ProfessorMapper professorMapper;

    @Operation(summary = "Create a new professor")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Professor created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create professor", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<ProfessorResponseDTO> createProfessor(@RequestBody ProfessorInsertDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(professorMapper.toResponseDTO(professorService.createProfessor(dto)));
    }

    @Operation(summary = "Get professor by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Professor retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Professor not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProfessorResponseDTO> getProfessorById(@PathVariable Long id) {
        return ResponseEntity.ok(
                professorMapper.toResponseDTO(professorService.getProfessorById(id))
        );
    }

    @Operation(summary = "Get all professors")
    @ApiResponse(responseCode = "200", description = "List of professors retrieved successfully")
    @GetMapping
    public ResponseEntity<List<ProfessorResponseDTO>> getAllProfessors() {
        return ResponseEntity.ok(
                professorService.getAllProfessors().stream().map(professorMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Update professor")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Professor updated successfully"),
            @ApiResponse(responseCode = "404", description = "Professor not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ProfessorResponseDTO> updateProfessor(@RequestBody ProfessorInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                professorMapper.toResponseDTO(professorService.updateProfessor(id, dto))
        );
    }

    @Operation(summary = "Delete professor by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Professor deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Professor not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfessor(@PathVariable Long id) {
        professorService.deleteProfessor(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch professor")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Professor patched successfully"),
            @ApiResponse(responseCode = "404", description = "Professor not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<ProfessorResponseDTO> patchProfessor(@RequestBody ProfessorInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                professorMapper.toResponseDTO(professorService.patchProfessor(id, dto))
        );
    }

    @Operation(summary = "Search professors with filters")
    @ApiResponse(responseCode = "200", description = "List of professors retrieved successfully")
    @GetMapping("/search")
    public ResponseEntity<List<ProfessorResponseDTO>> searchProfessors(@ParameterObject @ModelAttribute ProfessorFilterDTO filterDTO) {
        return ResponseEntity.ok(
                professorService.searchProfessors(filterDTO)
        );
    }
}
