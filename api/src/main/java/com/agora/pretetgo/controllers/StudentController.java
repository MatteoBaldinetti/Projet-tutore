package com.agora.pretetgo.controllers;

import com.agora.pretetgo.dto.filter.StudentFilterDTO;
import com.agora.pretetgo.dto.insert.StudentInsertDTO;
import com.agora.pretetgo.dto.response.StudentResponseDTO;
import com.agora.pretetgo.exceptions.ApiError;
import com.agora.pretetgo.mappers.StudentMapper;
import com.agora.pretetgo.models.Student;
import com.agora.pretetgo.services.StudentService;
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
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
@Tag(name = "Student", description = "Endpoints for managing students")
public class StudentController {
    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentMapper studentMapper;

    @Operation(summary = "Create a new student")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Student created successfully"),
            @ApiResponse(responseCode = "400", description = "Failed to create student", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PostMapping
    public ResponseEntity<StudentResponseDTO> createStudent(@RequestBody StudentInsertDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(studentMapper.toResponseDTO(studentService.createStudent(dto)));
    }

    @Operation(summary = "Get student by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Student retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Student not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(
                studentMapper.toResponseDTO(studentService.getStudentById(id))
        );
    }

    @Operation(summary = "Get all students")
    @ApiResponse(responseCode = "200", description = "List of students retrieved successfully")
    @GetMapping
    public ResponseEntity<List<StudentResponseDTO>> getAllStudents() {
        return ResponseEntity.ok(
                studentService.getAllStudents().stream().map(studentMapper::toResponseDTO).toList()
        );
    }

    @Operation(summary = "Update student")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Student updated successfully"),
            @ApiResponse(responseCode = "404", description = "Student not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> updateStudent(@RequestBody StudentInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                studentMapper.toResponseDTO(studentService.updateStudent(id, dto))
        );
    }

    @Operation(summary = "Delete student by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Student deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Student not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Patch student")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Student patched successfully"),
            @ApiResponse(responseCode = "404", description = "Student not found", content = @Content(schema = @Schema(implementation = ApiError.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<Student> patchStudent(@RequestBody StudentInsertDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(
                studentService.patchStudent(id, dto)
        );
    }

    @Operation(summary = "Search students with filters")
    @ApiResponse(responseCode = "200", description = "List of students retrieved successfully")
    @GetMapping("/search")
    public ResponseEntity<List<StudentResponseDTO>> searchStudents(StudentFilterDTO filterDTO) {
        return ResponseEntity.ok(
                studentService.searchStudents(filterDTO)
        );
    }
}
