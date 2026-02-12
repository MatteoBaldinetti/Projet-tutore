package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.filter.ItemFilterDTO;
import com.agora.pretetgo.dto.response.ItemResponseDTO;
import com.agora.pretetgo.dto.insert.ItemInsertDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.ItemMapper;
import com.agora.pretetgo.models.Item;
import com.agora.pretetgo.services.ItemService;
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
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
@Tag(name = "Item", description = "Endpoints for managing items")
public class ItemController {
    @Autowired
    private ItemService itemService;

    @Autowired
    private ItemMapper itemMapper;

    @Operation(summary = "Create a new item")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Item created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create item", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<ItemResponseDTO> createItem(@RequestBody ItemInsertDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(itemMapper.toResponseDTO(itemService.createItem(dto)));
    }

    @Operation(summary = "Get item by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Item retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Item not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ItemResponseDTO> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(
                itemMapper.toResponseDTO(itemService.getItemById(id))
        );
    }

    @Operation(summary = "Get all items")
    @ApiResponse(responseCode = "200", description = "List of items retrieved successfully")
    @GetMapping
    public ResponseEntity<List<ItemResponseDTO>> getAllItems() {
        return ResponseEntity.ok(
                itemService.getAllItems().stream().map(itemMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Update item")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Item updated successfully"),
            @ApiResponse(responseCode = "404", description = "Item not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ItemResponseDTO> updateItem(@RequestBody ItemInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                itemMapper.toResponseDTO(itemService.updateItem(id, dto))
        );
    }

    @Operation(summary = "Delete item by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Item deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Item not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch item")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Item patched successfully"),
            @ApiResponse(responseCode = "404", description = "Item not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<Item> patchItem(@RequestBody ItemInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                itemService.patchItem(id, dto)
        );
    }

    @Operation(summary = "Search items with filters")
    @ApiResponse(responseCode = "200", description = "List of items retrieved successfully")
    @GetMapping("/search")
    public ResponseEntity<List<ItemResponseDTO>> searchItems(@ParameterObject @ModelAttribute ItemFilterDTO filterDTO) {
        return ResponseEntity.ok(
                itemService.searchItems(filterDTO)
        );
    }
}
