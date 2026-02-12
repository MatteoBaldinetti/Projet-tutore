package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.filter.NotificationFilterDTO;
import com.agora.pretetgo.dto.response.NotificationResponseDTO;
import com.agora.pretetgo.dto.insert.NotificationInsertDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.NotificationMapper;
import com.agora.pretetgo.models.Notification;
import com.agora.pretetgo.services.NotificationService;
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
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
@Tag(name = "Notification", description = "Endpoints for managing notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationMapper notificationMapper;

    @Operation(summary = "Create a new notification")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Notification created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create notification", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<NotificationResponseDTO> createNotification(@RequestBody NotificationInsertDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(notificationMapper.toResponseDTO(notificationService.createNotification(dto)));
    }

    @Operation(summary = "Get notification by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Notification retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Notification not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponseDTO> getNotificationById(@PathVariable Long id) {
        return ResponseEntity.ok(
                notificationMapper.toResponseDTO(notificationService.getNotificationById(id))
        );
    }

    @Operation(summary = "Get all notifications")
    @ApiResponse(responseCode = "200", description = "List of notifications retrieved successfully")
    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>> getAllNotifications() {
        return ResponseEntity.ok(
                notificationService.getAllNotifications().stream().map(notificationMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Update notification")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Notification updated successfully"),
            @ApiResponse(responseCode = "404", description = "Notification not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<NotificationResponseDTO> updateNotification(@RequestBody NotificationInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                notificationMapper.toResponseDTO(notificationService.updateNotification(id, dto))
        );
    }

    @Operation(summary = "Delete notification by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Notification deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Notification not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch notification")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Notification patched successfully"),
            @ApiResponse(responseCode = "404", description = "Notification not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<Notification> patchNotification(@RequestBody NotificationInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                notificationService.patchNotification(id, dto)
        );
    }

    @Operation(summary = "Search notifications with filters")
    @ApiResponse(responseCode = "200", description = "List of notifications retrieved successfully")
    @GetMapping("/search")
    public ResponseEntity<List<NotificationResponseDTO>> searchNotifications(@ParameterObject @ModelAttribute NotificationFilterDTO filterDTO) {
        return ResponseEntity.ok(
                notificationService.searchNotifications(filterDTO)
        );
    }
}
