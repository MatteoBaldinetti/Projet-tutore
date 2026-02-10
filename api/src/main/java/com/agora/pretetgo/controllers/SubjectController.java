package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.insert.SubjectDTO;
import com.agora.pretetgo.dto.response.SubjectResponseDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.SubjectMapper;
import com.agora.pretetgo.models.Subject;
import com.agora.pretetgo.services.SubjectService;
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
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
@Tag(name = "Subject", description = "Endpoints for managing subjects")
public class SubjectController {
    @Autowired
    private SubjectService subjectService;

    @Autowired
    private SubjectMapper subjectMapper;

    @Operation(summary = "Create a new subject")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Subject created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create subject", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<SubjectResponseDTO> createSubject(@RequestBody SubjectDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(subjectMapper.toResponseDTO(subjectService.createSubject(dto)));
    }

    @Operation(summary = "Get subject by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Subject retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Subject not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<SubjectResponseDTO> getSubjectById(@PathVariable Long id) {
        return ResponseEntity.ok(
                subjectMapper.toResponseDTO(subjectService.getSubjectById(id))
        );
    }

    @Operation(summary = "Get all subjects")
    @ApiResponse(responseCode = "200", description = "List of subjects retrieved successfully")
    @GetMapping
    public ResponseEntity<List<SubjectResponseDTO>> getAllSubjects() {
        return ResponseEntity.ok(
                subjectService.getAllSubjects().stream().map(subjectMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Update subject")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Subject updated successfully"),
            @ApiResponse(responseCode = "404", description = "Subject not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<SubjectResponseDTO> updateSubject(@RequestBody SubjectDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                subjectMapper.toResponseDTO(subjectService.updateSubject(id, dto))
        );
    }

    @Operation(summary = "Delete subject by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Subject deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Subject not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch subject")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Subject patched successfully"),
            @ApiResponse(responseCode = "404", description = "Subject not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<Subject> patchSubject(@RequestBody SubjectDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                subjectService.patchSubject(id, dto)
        );
    }
}
