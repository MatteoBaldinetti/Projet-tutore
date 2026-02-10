package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.insert.ItemTypeDTO;
import com.agora.pretetgo.dto.response.ItemTypeResponseDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.ItemTypeMapper;
import com.agora.pretetgo.models.ItemType;
import com.agora.pretetgo.services.ItemTypeService;
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
@RequestMapping("/api/itemTypes")
@CrossOrigin(origins = "*")
@Tag(name = "ItemType", description = "Endpoints for managing itemTypes")
public class ItemTypeController {
    @Autowired
    private ItemTypeService itemTypeService;

    @Autowired
    private ItemTypeMapper itemTypeMapper;

    @Operation(summary = "Create a new itemType")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "ItemType created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create itemType", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<ItemTypeResponseDTO> createItemType(@RequestBody ItemTypeDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(itemTypeMapper.toResponseDTO(itemTypeService.createItemType(dto)));
    }

    @Operation(summary = "Get itemType by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "ItemType retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "ItemType not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ItemTypeResponseDTO> getItemTypeById(@PathVariable Long id) {
        return ResponseEntity.ok(
                itemTypeMapper.toResponseDTO(itemTypeService.getItemTypeById(id))
        );
    }

    @Operation(summary = "Get all itemTypes")
    @ApiResponse(responseCode = "200", description = "List of itemTypes retrieved successfully")
    @GetMapping
    public ResponseEntity<List<ItemTypeResponseDTO>> getAllItemTypes() {
        return ResponseEntity.ok(
                itemTypeService.getAllItemTypes().stream().map(itemTypeMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Update itemType")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "ItemType updated successfully"),
            @ApiResponse(responseCode = "404", description = "ItemType not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ItemTypeResponseDTO> updateItemType(@RequestBody ItemTypeDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                itemTypeMapper.toResponseDTO(itemTypeService.updateItemType(id, dto))
        );
    }

    @Operation(summary = "Delete itemType by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "ItemType deleted successfully"),
            @ApiResponse(responseCode = "404", description = "ItemType not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItemType(@PathVariable Long id) {
        itemTypeService.deleteItemType(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch itemType")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "ItemType patched successfully"),
            @ApiResponse(responseCode = "404", description = "ItemType not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<ItemType> patchItemType(@RequestBody ItemTypeDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                itemTypeService.patchItemType(id, dto)
        );
    }
}
