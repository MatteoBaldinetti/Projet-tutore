package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.filter.ClassroomFilterDTO;
import com.agora.pretetgo.dto.response.ClassroomResponseDTO;
import com.agora.pretetgo.dto.insert.ClassroomInsertDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.ClassroomMapper;
import com.agora.pretetgo.models.Classroom;
import com.agora.pretetgo.services.ClassroomService;
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
@RequestMapping("/api/classrooms")
@CrossOrigin(origins = "*")
@Tag(name = "Classroom", description = "Endpoints for managing classrooms")
public class ClassroomController {
    @Autowired
    private ClassroomService classroomService;

    @Autowired
    private ClassroomMapper classroomMapper;

    @Operation(summary = "Create a new classroom")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Classroom created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create classroom", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<ClassroomResponseDTO> createClassroom(@RequestBody ClassroomInsertDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(classroomMapper.toResponseDTO(classroomService.createClassroom(dto)));
    }

    @Operation(summary = "Get classroom by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Classroom retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Classroom not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ClassroomResponseDTO> getClassroomById(@PathVariable Long id) {
        return ResponseEntity.ok(
                classroomMapper.toResponseDTO(classroomService.getClassroomById(id))
        );
    }

    @Operation(summary = "Get all classrooms")
    @ApiResponse(responseCode = "200", description = "List of classrooms retrieved successfully")
    @GetMapping
    public ResponseEntity<List<ClassroomResponseDTO>> getAllClassrooms() {
        return ResponseEntity.ok(
                classroomService.getAllClassrooms().stream().map(classroomMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Update classroom")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Classroom updated successfully"),
            @ApiResponse(responseCode = "404", description = "Classroom not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ClassroomResponseDTO> updateClassroom(@RequestBody ClassroomInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                classroomMapper.toResponseDTO(classroomService.updateClassroom(id, dto))
        );
    }

    @Operation(summary = "Delete classroom by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Classroom deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Classroom not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClassroom(@PathVariable Long id) {
        classroomService.deleteClassroom(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch classroom")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Classroom patched successfully"),
            @ApiResponse(responseCode = "404", description = "Classroom not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<Classroom> patchClassroom(@RequestBody ClassroomInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                classroomService.patchClassroom(id, dto)
        );
    }

    @Operation(summary = "Search classrooms with filters")
    @ApiResponse(responseCode = "200", description = "List of classrooms retrieved successfully")
    @GetMapping("/search")
    public ResponseEntity<List<ClassroomResponseDTO>> searchClassrooms(@ParameterObject @ModelAttribute ClassroomFilterDTO filterDTO) {
        return ResponseEntity.ok(
                classroomService.searchClassrooms(filterDTO)
        );
    }
}
