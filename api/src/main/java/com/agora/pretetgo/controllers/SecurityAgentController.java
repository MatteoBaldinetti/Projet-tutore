package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.filter.SecurityAgentFilterDTO;
import com.agora.pretetgo.dto.response.SecurityAgentResponseDTO;
import com.agora.pretetgo.dto.insert.SecurityAgentInsertDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.SecurityAgentMapper;
import com.agora.pretetgo.services.SecurityAgentService;
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
@RequestMapping("/api/security")
@CrossOrigin(origins = "*")
@Tag(name = "SecurityAgent", description = "Endpoints for managing securityAgents")
public class SecurityAgentController {
    @Autowired
    private SecurityAgentService securityAgentService;

    @Autowired
    private SecurityAgentMapper securityAgentMapper;

    @Operation(summary = "Create a new securityAgent")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "SecurityAgent created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create securityAgent", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<SecurityAgentResponseDTO> createSecurityAgent(@RequestBody SecurityAgentInsertDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(securityAgentMapper.toResponseDTO(securityAgentService.createSecurityAgent(dto)));
    }

    @Operation(summary = "Get securityAgent by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "SecurityAgent retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "SecurityAgent not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<SecurityAgentResponseDTO> getSecurityAgentById(@PathVariable Long id) {
        return ResponseEntity.ok(
                securityAgentMapper.toResponseDTO(securityAgentService.getSecurityAgentById(id))
        );
    }

    @Operation(summary = "Get all securityAgents")
    @ApiResponse(responseCode = "200", description = "List of securityAgents retrieved successfully")
    @GetMapping
    public ResponseEntity<List<SecurityAgentResponseDTO>> getAllSecurityAgents() {
        return ResponseEntity.ok(
                securityAgentService.getAllSecurityAgents().stream().map(securityAgentMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Update securityAgent")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "SecurityAgent updated successfully"),
            @ApiResponse(responseCode = "404", description = "SecurityAgent not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<SecurityAgentResponseDTO> updateSecurityAgent(@RequestBody SecurityAgentInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                securityAgentMapper.toResponseDTO(securityAgentService.updateSecurityAgent(id, dto))
        );
    }

    @Operation(summary = "Delete securityAgent by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "SecurityAgent deleted successfully"),
            @ApiResponse(responseCode = "404", description = "SecurityAgent not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSecurityAgent(@PathVariable Long id) {
        securityAgentService.deleteSecurityAgent(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch securityAgent")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "SecurityAgent patched successfully"),
            @ApiResponse(responseCode = "404", description = "SecurityAgent not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<SecurityAgentResponseDTO> patchSecurityAgent(@RequestBody SecurityAgentInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                securityAgentMapper.toResponseDTO(securityAgentService.patchSecurityAgent(id, dto))
        );
    }

    @Operation(summary = "Search securityAgents with filters")
    @ApiResponse(responseCode = "200", description = "List of securityAgents retrieved successfully")
    @GetMapping("/search")
    public ResponseEntity<List<SecurityAgentResponseDTO>> searchSecurityAgents(@ParameterObject @ModelAttribute SecurityAgentFilterDTO filterDTO) {
        return ResponseEntity.ok(
                securityAgentService.searchSecurityAgents(filterDTO)
        );
    }
}
