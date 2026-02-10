package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.insert.FileMetaDataDTO;
import com.agora.pretetgo.dto.response.FileMetaDataResponseDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.FileMetaDataMapper;
import com.agora.pretetgo.models.FileMetaData;
import com.agora.pretetgo.services.FileMetaDataService;
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
@RequestMapping("/api/fileMetaDatas")
@CrossOrigin(origins = "*")
@Tag(name = "FileMetaData", description = "Endpoints for managing fileMetaDatas")
public class FileMetaDataController {
    @Autowired
    private FileMetaDataService fileMetaDataService;

    @Autowired
    private FileMetaDataMapper fileMetaDataMapper;

    @Operation(summary = "Create a new fileMetaData")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "FileMetaData created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create fileMetaData", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<FileMetaDataResponseDTO> createFileMetaData(@RequestBody FileMetaDataDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(fileMetaDataMapper.toResponseDTO(fileMetaDataService.createFileMetaData(dto)));
    }

    @Operation(summary = "Get fileMetaData by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "FileMetaData retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "FileMetaData not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<FileMetaDataResponseDTO> getFileMetaDataById(@PathVariable Long id) {
        return ResponseEntity.ok(
                fileMetaDataMapper.toResponseDTO(fileMetaDataService.getFileMetaDataById(id))
        );
    }

    @Operation(summary = "Get all fileMetaDatas")
    @ApiResponse(responseCode = "200", description = "List of fileMetaDatas retrieved successfully")
    @GetMapping
    public ResponseEntity<List<FileMetaDataResponseDTO>> getAllFileMetaDatas() {
        return ResponseEntity.ok(
                fileMetaDataService.getAllFileMetaData().stream().map(fileMetaDataMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Update fileMetaData")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "FileMetaData updated successfully"),
            @ApiResponse(responseCode = "404", description = "FileMetaData not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<FileMetaDataResponseDTO> updateFileMetaData(@RequestBody FileMetaDataDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                fileMetaDataMapper.toResponseDTO(fileMetaDataService.updateFileMetaData(id, dto))
        );
    }

    @Operation(summary = "Delete fileMetaData by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "FileMetaData deleted successfully"),
            @ApiResponse(responseCode = "404", description = "FileMetaData not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFileMetaData(@PathVariable Long id) {
        fileMetaDataService.deleteFileMetaData(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch fileMetaData")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "FileMetaData patched successfully"),
            @ApiResponse(responseCode = "404", description = "FileMetaData not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<FileMetaData> patchFileMetaData(@RequestBody FileMetaDataDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                fileMetaDataService.patchFileMetaData(id, dto)
        );
    }
}
