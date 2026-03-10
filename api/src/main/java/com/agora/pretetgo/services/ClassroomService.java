package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.filter.ClassroomFilterDTO;
import com.agora.pretetgo.dto.response.ClassroomResponseDTO;
import com.agora.pretetgo.dto.insert.ClassroomInsertDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.ClassroomMapper;
import com.agora.pretetgo.models.*;
import com.agora.pretetgo.repositories.ClassroomRepository;
import com.agora.pretetgo.repositories.FileMetaDataRepository;
import com.agora.pretetgo.repositories.ProfessorRepository;
import com.agora.pretetgo.repositories.TagRepository;
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
    private FileMetaDataService fileMetaDataService;

    @Autowired
    private ClassroomTypeService classroomTypeService;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private FileMetaDataRepository fileMetaDataRepository;

    @Autowired
    private TagRepository tagRepository;

    @Transactional
    public Classroom createClassroom(ClassroomInsertDTO dto) {
        Classroom classroom = classroomMapper.toEntity(dto);
        mapDTOIds(dto, classroom);
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
        mapDTOIds(dto, current);
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
        mapDTOIds(dto, current);
        return classroomRepository.save(current);
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

    private void mapDTOIds(ClassroomInsertDTO dto, Classroom current) {
        fetchManagedBy(dto.managedByIds(), current);
        fetchFileMetaData(dto.imageIds(), current);
        setModel3d(dto, current);
        fetchTag(dto.tagIds(), current);
        setClassroomType(dto, current);
    }

    private void setModel3d(ClassroomInsertDTO dto, Classroom current) {
        if (dto.model3dId() != null) {
            FileMetaData fileMetaData = fileMetaDataService.getFileMetaDataById(dto.model3dId());
            current.setModel3d(fileMetaData);
        }
    }

    private void setClassroomType(ClassroomInsertDTO dto, Classroom current) {
        if (dto.classroomTypeId() != null) {
            ClassroomType classroomType = classroomTypeService.getClassroomTypeById(dto.classroomTypeId());
            current.setClassroomType(classroomType);
        }
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

        for (Professor professor : professors) {
            professor.getResources().add(classroom);
        }
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

        for (FileMetaData fileMetaData1 : fileMetaData) {
            fileMetaData1.getResourcesImages().add(classroom);
        }
    }

    private void fetchTag(Set<Long> tagId, Classroom classroom) {
        if (tagId == null) return;

        Set<Tag> tags = tagId.stream()
                .map(id -> tagRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Tag with ID " + id + " not found")
                        )
                )
                .collect(Collectors.toSet());

        classroom.setTags(tags);

        for (Tag tag : tags) {
            tag.getResources().add(classroom);
        }
    }
}
