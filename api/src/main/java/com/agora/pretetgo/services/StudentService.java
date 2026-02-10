package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.insert.StudentDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.StudentMapper;
import com.agora.pretetgo.models.Student;
import com.agora.pretetgo.repositories.StudentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StudentMapper studentMapper;

    @Transactional
    public Student createStudent(StudentDTO dto) {
        Student student = studentMapper.toEntity(dto);
        return studentRepository.save(student);
    }

    @Transactional
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student with ID " + id + " not found"));
    }

    @Transactional
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Transactional
    public Student updateStudent(Long id, StudentDTO dto) {
        Student current = getStudentById(id);
        studentMapper.updateStudentFromDto(dto, current);
        return studentRepository.save(current);
    }

    @Transactional
    public void deleteStudent(Long id) {
        studentRepository.deleteById(getStudentById(id).getId());
    }

    @Transactional
    public Student patchStudent(Long id, StudentDTO dto) {
        Student current = getStudentById(id);
        studentMapper.patchStudentFromDto(dto, current);
        return studentRepository.save(current);
    }
}