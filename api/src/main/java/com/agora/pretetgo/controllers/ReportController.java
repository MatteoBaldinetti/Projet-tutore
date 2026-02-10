package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.insert.ReportDTO;
import com.agora.pretetgo.dto.response.ReportResponseDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.ReportMapper;
import com.agora.pretetgo.models.Report;
import com.agora.pretetgo.services.ReportService;
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
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
@Tag(name = "Report", description = "Endpoints for managing reports")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @Autowired
    private ReportMapper reportMapper;

    @Operation(summary = "Create a new report")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Report created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create report", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<ReportResponseDTO> createReport(@RequestBody ReportDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reportMapper.toResponseDTO(reportService.createReport(dto)));
    }

    @Operation(summary = "Get report by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Report retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Report not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ReportResponseDTO> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(
                reportMapper.toResponseDTO(reportService.getReportById(id))
        );
    }

    @Operation(summary = "Get all reports")
    @ApiResponse(responseCode = "200", description = "List of reports retrieved successfully")
    @GetMapping
    public ResponseEntity<List<ReportResponseDTO>> getAllReports() {
        return ResponseEntity.ok(
                reportService.getAllReports().stream().map(reportMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Update report")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Report updated successfully"),
            @ApiResponse(responseCode = "404", description = "Report not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ReportResponseDTO> updateReport(@RequestBody ReportDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                reportMapper.toResponseDTO(reportService.updateReport(id, dto))
        );
    }

    @Operation(summary = "Delete report by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Report deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Report not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch report")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Report patched successfully"),
            @ApiResponse(responseCode = "404", description = "Report not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<Report> patchReport(@RequestBody ReportDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                reportService.patchReport(id, dto)
        );
    }
}
