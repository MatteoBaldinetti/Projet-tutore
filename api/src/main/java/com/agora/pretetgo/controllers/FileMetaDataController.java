package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.filter.FileMetaDataFilterDTO;
import com.agora.pretetgo.dto.response.FileMetaDataResponseDTO;
import com.agora.pretetgo.dto.insert.FileMetaDataInsertDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.FileMetaDataMapper;
import com.agora.pretetgo.models.FileMetaData;
import com.agora.pretetgo.services.FileMetaDataService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/fileMetaData")
@CrossOrigin(origins = "*")
@Tag(name = "FileMetaData", description = "Endpoints for managing fileMetaData")
public class FileMetaDataController {
    @Autowired
    private FileMetaDataService fileMetaDataService;

    @Autowired
    private FileMetaDataMapper fileMetaDataMapper;

    @Operation(summary = "Upload a file")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "File uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Upload failed", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileMetaData> uploadFile(
            @Parameter(description = "File to upload")
            @RequestPart("file") MultipartFile file
    ) {
        FileMetaData savedFile = fileMetaDataService.uploadFile(file);
        return ResponseEntity.ok(savedFile);
    }

    @Operation(summary = "Download a file")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "File downloaded successfully"),
            @ApiResponse(responseCode = "404", description = "File not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(
            @Parameter(description = "Name of the file")
            @PathVariable String fileName
    ) {
        return fileMetaDataService.downloadFile(fileName);
    }

    @Operation(summary = "Create a new fileMetaData")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "FileMetaData created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create fileMetaData", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<FileMetaDataResponseDTO> createFileMetaData(@RequestBody FileMetaDataInsertDTO dto) {
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

    @Operation(summary = "Get all fileMetaData")
    @ApiResponse(responseCode = "200", description = "List of fileMetaData retrieved successfully")
    @GetMapping
    public ResponseEntity<List<FileMetaDataResponseDTO>> getAllFileMetaData() {
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
    public ResponseEntity<FileMetaDataResponseDTO> updateFileMetaData(@RequestBody FileMetaDataInsertDTO dto, @PathVariable Long id) {
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
    public ResponseEntity<FileMetaDataResponseDTO> patchFileMetaData(@RequestBody FileMetaDataInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                fileMetaDataMapper.toResponseDTO(fileMetaDataService.patchFileMetaData(id, dto))
        );
    }

    @Operation(summary = "Search fileMetaData with filters")
    @ApiResponse(responseCode = "200", description = "List of fileMetaData retrieved successfully")
    @GetMapping("/search")
    public ResponseEntity<List<FileMetaDataResponseDTO>> searchFileMetaData(@ParameterObject @ModelAttribute FileMetaDataFilterDTO filterDTO) {
        return ResponseEntity.ok(
                fileMetaDataService.searchFileMetaData(filterDTO)
        );
    }
}
