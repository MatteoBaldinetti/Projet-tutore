package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.filter.ClassroomFilterDTO;
import com.agora.pretetgo.dto.response.ClassroomResponseDTO;
import com.agora.pretetgo.dto.insert.ClassroomInsertDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.ClassroomMapper;
import com.agora.pretetgo.models.Classroom;
import com.agora.pretetgo.models.FileMetaData;
import com.agora.pretetgo.models.Professor;
import com.agora.pretetgo.repositories.ClassroomRepository;
import com.agora.pretetgo.repositories.FileMetaDataRepository;
import com.agora.pretetgo.repositories.ProfessorRepository;
import com.agora.pretetgo.specifications.ClassroomSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ClassroomService {
    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private ClassroomMapper classroomMapper;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private FileMetaDataRepository fileMetaDataRepository;

    @Transactional
    public Classroom createClassroom(ClassroomInsertDTO dto) {
        Classroom classroom = classroomMapper.toEntity(dto);
        fetchManagedBy(dto.managedByIds(), classroom);
        fetchFileMetaData(dto.imageIds(), classroom);
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
        fetchManagedBy(dto.managedByIds(), current);
        fetchFileMetaData(dto.imageIds(), current);
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
        fetchManagedBy(dto.managedByIds(), current);
        fetchFileMetaData(dto.imageIds(), current);
        return classroomRepository.save(current);
    }

    private void fetchManagedBy(Set<Long> professorIds, Classroom classroom) {
        if (professorIds == null) return;

        Set<Professor> professors = professorIds.stream()
                .map(id -> professorRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Professor with ID " + id + " not found")
                        )
                )
                .collect(Collectors.toSet());

        classroom.setManagedBy(professors);
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

    private void fetchFileMetaData(Set<Long> fileMetaDataId, Classroom classroom) {
        if (fileMetaDataId == null) return;

        Set<FileMetaData> fileMetaData = fileMetaDataId.stream()
                .map(id -> fileMetaDataRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("FileMetaData with ID " + id + " not found")
                        )
                )
                .collect(Collectors.toSet());

        classroom.setImages(fileMetaData);
    }
}
