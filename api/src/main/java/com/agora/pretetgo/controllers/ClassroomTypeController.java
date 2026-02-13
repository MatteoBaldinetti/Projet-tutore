package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.filter.ClassroomTypeFilterDTO;
import com.agora.pretetgo.dto.insert.ClassroomTypeInsertDTO;
import com.agora.pretetgo.dto.response.ClassroomTypeResponseDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.ClassroomTypeMapper;
import com.agora.pretetgo.services.ClassroomTypeService;
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
@RequestMapping("/api/classroomTypes")
@CrossOrigin(origins = "*")
@Tag(name = "ClassroomType", description = "Endpoints for managing classroomTypes")
public class ClassroomTypeController {
    @Autowired
    private ClassroomTypeService classroomTypeService;

    @Autowired
    private ClassroomTypeMapper classroomTypeMapper;

    @Operation(summary = "Create a new classroomType")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "ClassroomType created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create classroomType", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<ClassroomTypeResponseDTO> createClassroomType(@RequestBody ClassroomTypeInsertDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(classroomTypeMapper.toResponseDTO(classroomTypeService.createClassroomType(dto)));
    }

    @Operation(summary = "Get classroomType by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "ClassroomType retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "ClassroomType not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ClassroomTypeResponseDTO> getClassroomTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(
                classroomTypeMapper.toResponseDTO(classroomTypeService.getClassroomTypeById(id))
        );
    }

    @Operation(summary = "Get all classroomTypes")
    @ApiResponse(responseCode = "200", description = "List of classroomTypes retrieved successfully")
    @GetMapping
    public ResponseEntity<List<ClassroomTypeResponseDTO>> getAllClassroomTypes() {
        return ResponseEntity.ok(
                classroomTypeService.getAllClassroomTypes().stream().map(classroomTypeMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Update classroomType")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "ClassroomType updated successfully"),
            @ApiResponse(responseCode = "404", description = "ClassroomType not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ClassroomTypeResponseDTO> updateClassroomType(@RequestBody ClassroomTypeInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                classroomTypeMapper.toResponseDTO(classroomTypeService.updateClassroomType(id, dto))
        );
    }

    @Operation(summary = "Delete classroomType by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "ClassroomType deleted successfully"),
            @ApiResponse(responseCode = "404", description = "ClassroomType not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClassroomType(@PathVariable Long id) {
        classroomTypeService.deleteClassroomType(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch classroomType")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "ClassroomType patched successfully"),
            @ApiResponse(responseCode = "404", description = "ClassroomType not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<ClassroomTypeResponseDTO> patchClassroomType(@RequestBody ClassroomTypeInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                classroomTypeMapper.toResponseDTO(classroomTypeService.patchClassroomType(id, dto))
        );
    }

    @Operation(summary = "Search classroomTypes with filters")
    @ApiResponse(responseCode = "200", description = "List of classroomTypes retrieved successfully")
    @GetMapping("/search")
    public ResponseEntity<List<ClassroomTypeResponseDTO>> searchClassroomTypes(@ParameterObject @ModelAttribute ClassroomTypeFilterDTO filterDTO) {
        return ResponseEntity.ok(
                classroomTypeService.searchClassroomTypes(filterDTO)
        );
    }
}
