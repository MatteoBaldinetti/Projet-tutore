package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.filter.ResourceFilterDTO;
import com.agora.pretetgo.dto.response.ResourceResponseDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.ResourceMapper;
import com.agora.pretetgo.services.ResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
@Tag(name = "Resource", description = "Endpoints for managing resources")
public class ResourceController {
    @Autowired
    private ResourceService resourceService;

    @Autowired
    private ResourceMapper resourceMapper;

    @Operation(summary = "Get resource by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resource retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Resource not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(
                resourceMapper.toResponseDTO(resourceService.getResourceById(id))
        );
    }

    @Operation(summary = "Get all resources")
    @ApiResponse(responseCode = "200", description = "List of resources retrieved successfully")
    @GetMapping
    public ResponseEntity<List<ResourceResponseDTO>> getAllResources() {
        return ResponseEntity.ok(
                resourceService.getAllResources().stream().map(resourceMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Delete resource by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Resource deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Resource not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Search resources with filters")
    @ApiResponse(responseCode = "200", description = "List of resources retrieved successfully")
    @GetMapping("/search")
    public ResponseEntity<List<ResourceResponseDTO>> searchResources(ResourceFilterDTO filterDTO) {
        return ResponseEntity.ok(
                resourceService.searchResources(filterDTO)
        );
    }
}
