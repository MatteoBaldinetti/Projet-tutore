package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.filter.TagFilterDTO;
import com.agora.pretetgo.dto.insert.TagInsertDTO;
import com.agora.pretetgo.dto.response.TagResponseDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.TagMapper;
import com.agora.pretetgo.services.TagService;
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
@RequestMapping("/api/tags")
@CrossOrigin(origins = "*")
@Tag(name = "Tag", description = "Endpoints for managing tags")
public class TagController {
    @Autowired
    private TagService tagService;

    @Autowired
    private TagMapper tagMapper;

    @Operation(summary = "Create a new tag")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Tag created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create tag", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<TagResponseDTO> createTag(@RequestBody TagInsertDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tagMapper.toResponseDTO(tagService.createTag(dto)));
    }

    @Operation(summary = "Get tag by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tag retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Tag not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<TagResponseDTO> getTagById(@PathVariable Long id) {
        return ResponseEntity.ok(
                tagMapper.toResponseDTO(tagService.getTagById(id))
        );
    }

    @Operation(summary = "Get all tags")
    @ApiResponse(responseCode = "200", description = "List of tags retrieved successfully")
    @GetMapping
    public ResponseEntity<List<TagResponseDTO>> getAllTags() {
        return ResponseEntity.ok(
                tagService.getAllTags().stream().map(tagMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Update tag")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tag updated successfully"),
            @ApiResponse(responseCode = "404", description = "Tag not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<TagResponseDTO> updateTag(@RequestBody TagInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                tagMapper.toResponseDTO(tagService.updateTag(id, dto))
        );
    }

    @Operation(summary = "Delete tag by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Tag deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Tag not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch tag")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tag patched successfully"),
            @ApiResponse(responseCode = "404", description = "Tag not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<TagResponseDTO> patchTag(@RequestBody TagInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                tagMapper.toResponseDTO(tagService.patchTag(id, dto))
        );
    }

    @Operation(summary = "Search tags with filters")
    @ApiResponse(responseCode = "200", description = "List of tags retrieved successfully")
    @GetMapping("/search")
    public ResponseEntity<List<TagResponseDTO>> searchTags(@ParameterObject @ModelAttribute TagFilterDTO filterDTO) {
        return ResponseEntity.ok(
                tagService.searchTags(filterDTO)
        );
    }
}
