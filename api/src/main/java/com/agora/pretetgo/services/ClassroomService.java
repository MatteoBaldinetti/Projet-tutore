package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.filter.ClassroomFilterDTO;
import com.agora.pretetgo.dto.response.ClassroomResponseDTO;
import com.agora.pretetgo.dto.insert.ClassroomInsertDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.ClassroomMapper;
import com.agora.pretetgo.models.Classroom;
import com.agora.pretetgo.models.Professor;
import com.agora.pretetgo.repositories.ClassroomRepository;
import com.agora.pretetgo.specifications.ClassroomSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassroomService {
    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private ClassroomMapper classroomMapper;

    @Autowired
    private ProfessorService professorService;

    @Transactional
    public Classroom createClassroom(ClassroomInsertDTO dto) {
        Classroom classroom = classroomMapper.toEntity(dto);
        setManagedBy(dto, classroom);
        return classroomRepository.save(classroom);
    }

    @Transactional
    public Classroom getClassroomById(Long id) {
        return classroomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classroom with ID " + id + " not found"));
    }

    @Transactional
    public List<Classroom> getAllClassrooms() {
        return classroomRepository.findAll();
    }

    @Transactional
    public Classroom updateClassroom(Long id, ClassroomInsertDTO dto) {
        Classroom current = getClassroomById(id);
        classroomMapper.updateClassroomFromDto(dto, current);
        setManagedBy(dto, current);
        return classroomRepository.save(current);
    }

    @Transactional
    public void deleteClassroom(Long id) {
        classroomRepository.deleteById(getClassroomById(id).getId());
    }

    @Transactional
    public Classroom patchClassroom(Long id, ClassroomInsertDTO dto) {
        Classroom current = getClassroomById(id);
        classroomMapper.patchClassroomFromDto(dto, current);
        setManagedBy(dto, current);
        return classroomRepository.save(current);
    }

    private void setManagedBy(ClassroomInsertDTO dto, Classroom current) {
        if (dto.managedById() != null) {
            Professor professor = professorService.getProfessorById(dto.managedById());
            current.setManagedBy(professor);
        }
    }

    @Transactional
    public List<ClassroomResponseDTO> searchClassrooms(ClassroomFilterDTO filterDTO) {
        return classroomRepository.findAll(
                ClassroomSpecification.withFilter(filterDTO)
        )
                .stream()
                .map(classroomMapper::toResponseDTO)
                .toList();
    }
}
