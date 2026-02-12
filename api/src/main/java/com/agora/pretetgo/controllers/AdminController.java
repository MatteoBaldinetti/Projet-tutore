package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.filter.AdminFilterDTO;
import com.agora.pretetgo.dto.response.AdminResponseDTO;
import com.agora.pretetgo.dto.insert.AdminInsertDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.AdminMapper;
import com.agora.pretetgo.models.Admin;
import com.agora.pretetgo.services.AdminService;
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
@RequestMapping("/api/admins")
@CrossOrigin(origins = "*")
@Tag(name = "Admin", description = "Endpoints for managing admins")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @Autowired
    private AdminMapper adminMapper;

    @Operation(summary = "Create a new admin")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Admin created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create admin", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<AdminResponseDTO> createAdmin(@RequestBody AdminInsertDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminMapper.toResponseDTO(adminService.createAdmin(dto)));
    }

    @Operation(summary = "Get admin by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Admin retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Admin not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<AdminResponseDTO> getAdminById(@PathVariable Long id) {
        return ResponseEntity.ok(
                adminMapper.toResponseDTO(adminService.getAdminById(id))
        );
    }

    @Operation(summary = "Get all admins")
    @ApiResponse(responseCode = "200", description = "List of admins retrieved successfully")
    @GetMapping
    public ResponseEntity<List<AdminResponseDTO>> getAllAdmins() {
        return ResponseEntity.ok(
                adminService.getAllAdmins().stream().map(adminMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Update admin")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Admin updated successfully"),
            @ApiResponse(responseCode = "404", description = "Admin not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<AdminResponseDTO> updateAdmin(@RequestBody AdminInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                adminMapper.toResponseDTO(adminService.updateAdmin(id, dto))
        );
    }

    @Operation(summary = "Delete admin by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Admin deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Admin not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch admin")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Admin patched successfully"),
            @ApiResponse(responseCode = "404", description = "Admin not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<Admin> patchAdmin(@RequestBody AdminInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                adminService.patchAdmin(id, dto)
        );
    }

    @Operation(summary = "Search admins with filters")
    @ApiResponse(responseCode = "200", description = "List of admins retrieved successfully")
    @GetMapping("/search")
    public ResponseEntity<List<AdminResponseDTO>> searchAdmins(AdminFilterDTO filterDTO) {
        return ResponseEntity.ok(
                adminService.searchAdmins(filterDTO)
        );
    }
}
