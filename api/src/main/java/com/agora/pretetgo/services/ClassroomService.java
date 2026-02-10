package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.insert.ClassroomDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.ClassroomMapper;
import com.agora.pretetgo.models.Classroom;
import com.agora.pretetgo.models.Professor;
import com.agora.pretetgo.repositories.ClassroomRepository;
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
    public Classroom createClassroom(ClassroomDTO dto) {
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
    public Classroom updateClassroom(Long id, ClassroomDTO dto) {
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
    public Classroom patchClassroom(Long id, ClassroomDTO dto) {
        Classroom current = getClassroomById(id);
        classroomMapper.patchClassroomFromDto(dto, current);
        setManagedBy(dto, current);
        return classroomRepository.save(current);
    }

    private void setManagedBy(ClassroomDTO dto, Classroom current) {
        if (dto.managedById() != null) {
            Professor professor = professorService.getProfessorById(dto.managedById());
            current.setManagedBy(professor);
        }
    }
}
