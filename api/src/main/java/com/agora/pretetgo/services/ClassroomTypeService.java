package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.filter.ClassroomTypeFilterDTO;
import com.agora.pretetgo.dto.insert.ClassroomTypeInsertDTO;
import com.agora.pretetgo.dto.response.ClassroomTypeResponseDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.ClassroomTypeMapper;
import com.agora.pretetgo.models.ClassroomType;
import com.agora.pretetgo.models.Professor;
import com.agora.pretetgo.repositories.ClassroomTypeRepository;
import com.agora.pretetgo.specifications.ClassroomTypeSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassroomTypeService {
    @Autowired
    private ClassroomTypeRepository classroomTypeRepository;

    @Autowired
    private ClassroomTypeMapper classroomTypeMapper;

    @Autowired
    private ProfessorService professorService;

    @Transactional
    public ClassroomType createClassroomType(ClassroomTypeInsertDTO dto) {
        ClassroomType classroomType = classroomTypeMapper.toEntity(dto);
        mapDTOIds(dto, classroomType);
        return classroomTypeRepository.save(classroomType);
    }

    @Transactional
    public ClassroomType getClassroomTypeById(Long id) {
        return classroomTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ClassroomType with ID " + id + " not found"));
    }

    @Transactional
    public List<ClassroomType> getAllClassroomTypes() {
        return classroomTypeRepository.findAll();
    }

    @Transactional
    public ClassroomType updateClassroomType(Long id, ClassroomTypeInsertDTO dto) {
        ClassroomType current = getClassroomTypeById(id);
        classroomTypeMapper.updateClassroomTypeFromDto(dto, current);
        mapDTOIds(dto, current);
        return classroomTypeRepository.save(current);
    }

    @Transactional
    public void deleteClassroomType(Long id) {
        classroomTypeRepository.deleteById(getClassroomTypeById(id).getId());
    }

    @Transactional
    public ClassroomType patchClassroomType(Long id, ClassroomTypeInsertDTO dto) {
        ClassroomType current = getClassroomTypeById(id);
        classroomTypeMapper.patchClassroomTypeFromDto(dto, current);
        mapDTOIds(dto, current);
        return classroomTypeRepository.save(current);
    }

    @Transactional
    public List<ClassroomTypeResponseDTO> searchClassroomTypes(ClassroomTypeFilterDTO filterDTO) {
        return classroomTypeRepository.findAll(
                        ClassroomTypeSpecification.withFilter(filterDTO)
                )
                .stream()
                .map(classroomTypeMapper::toResponseDTO)
                .toList();
    }

    private void mapDTOIds(ClassroomTypeInsertDTO dto, ClassroomType current) {
        setCreatedBy(dto, current);
    }

    private void setCreatedBy(ClassroomTypeInsertDTO dto, ClassroomType current) {
        if (dto.createdById() != null) {
            Professor professor = professorService.getProfessorById(dto.createdById());
            current.setCreatedBy(professor);
        }
    }
}