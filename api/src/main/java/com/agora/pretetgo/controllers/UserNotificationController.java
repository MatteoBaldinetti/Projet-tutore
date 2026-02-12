package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.filter.UserNotificationFilterDTO;
import com.agora.pretetgo.dto.response.UserNotificationResponseDTO;
import com.agora.pretetgo.dto.insert.UserNotificationInsertDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.UserNotificationMapper;
import com.agora.pretetgo.models.UserNotification;
import com.agora.pretetgo.services.UserNotificationService;
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
@RequestMapping("/api/userNotifications")
@CrossOrigin(origins = "*")
@Tag(name = "UserNotification", description = "Endpoints for managing userNotifications")
public class UserNotificationController {
    @Autowired
    private UserNotificationService userNotificationService;

    @Autowired
    private UserNotificationMapper userNotificationMapper;

    @Operation(summary = "Create a new userNotification")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "UserNotification created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create userNotification", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<UserNotificationResponseDTO> createUserNotification(@RequestBody UserNotificationInsertDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userNotificationMapper.toResponseDTO(userNotificationService.createUserNotification(dto)));
    }

    @Operation(summary = "Get userNotification by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "UserNotification retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "UserNotification not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<UserNotificationResponseDTO> getUserNotificationById(@PathVariable Long id) {
        return ResponseEntity.ok(
                userNotificationMapper.toResponseDTO(userNotificationService.getUserNotificationById(id))
        );
    }

    @Operation(summary = "Get all userNotifications")
    @ApiResponse(responseCode = "200", description = "List of userNotifications retrieved successfully")
    @GetMapping
    public ResponseEntity<List<UserNotificationResponseDTO>> getAllUserNotifications() {
        return ResponseEntity.ok(
                userNotificationService.getAllUserNotifications().stream().map(userNotificationMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Update userNotification")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "UserNotification updated successfully"),
            @ApiResponse(responseCode = "404", description = "UserNotification not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<UserNotificationResponseDTO> updateUserNotification(@RequestBody UserNotificationInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                userNotificationMapper.toResponseDTO(userNotificationService.updateUserNotification(id, dto))
        );
    }

    @Operation(summary = "Delete userNotification by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "UserNotification deleted successfully"),
            @ApiResponse(responseCode = "404", description = "UserNotification not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserNotification(@PathVariable Long id) {
        userNotificationService.deleteUserNotification(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch userNotification")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "UserNotification patched successfully"),
            @ApiResponse(responseCode = "404", description = "UserNotification not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<UserNotification> patchUserNotification(@RequestBody UserNotificationInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                userNotificationService.patchUserNotification(id, dto)
        );
    }

    @Operation(summary = "Search userNotifications with filters")
    @ApiResponse(responseCode = "200", description = "List of userNotifications retrieved successfully")
    @GetMapping("/search")
    public ResponseEntity<List<UserNotificationResponseDTO>> searchUserNotifications(@ParameterObject @ModelAttribute UserNotificationFilterDTO filterDTO) {
        return ResponseEntity.ok(
                userNotificationService.searchUserNotifications(filterDTO)
        );
    }
}
