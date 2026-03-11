package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.filter.ProfessorFilterDTO;
import com.agora.pretetgo.dto.insert.ProfessorInsertDTO;
import com.agora.pretetgo.dto.response.ProfessorResponseDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.ProfessorMapper;
import com.agora.pretetgo.models.Professor;
import com.agora.pretetgo.models.Resource;
import com.agora.pretetgo.models.Subject;
import com.agora.pretetgo.repositories.ProfessorRepository;
import com.agora.pretetgo.repositories.ResourceRepository;
import com.agora.pretetgo.repositories.SubjectRepository;
import com.agora.pretetgo.specifications.ProfessorSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProfessorService {
    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private ProfessorMapper professorMapper;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Transactional
    public Professor createProfessor(ProfessorInsertDTO dto) {
        Professor professor = professorMapper.toEntity(dto);
        mapDTOIds(dto, professor);
        return professorRepository.save(professor);
    }

    @Transactional
    public Professor getProfessorById(Long id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professor with ID " + id + " not found"));
    }

    @Transactional
    public List<Professor> getAllProfessors() {
        return professorRepository.findAll();
    }

    @Transactional
    public Professor updateProfessor(Long id, ProfessorInsertDTO dto) {
        Professor current = getProfessorById(id);
        professorMapper.updateProfessorFromDto(dto, current);
        mapDTOIds(dto, current);
        return professorRepository.save(current);
    }

    @Transactional
    public void deleteProfessor(Long id) {
        professorRepository.deleteById(getProfessorById(id).getId());
    }

    @Transactional
    public Professor patchProfessor(Long id, ProfessorInsertDTO dto) {
        Professor current = getProfessorById(id);
        professorMapper.patchProfessorFromDto(dto, current);
        mapDTOIds(dto, current);
        return professorRepository.save(current);
    }

    @Transactional
    public List<ProfessorResponseDTO> searchProfessors(ProfessorFilterDTO filterDTO) {
        return professorRepository.findAll(
                        ProfessorSpecification.withFilter(filterDTO)
                )
                .stream()
                .map(professorMapper::toResponseDTO)
                .toList();
    }

    private void mapDTOIds(ProfessorInsertDTO dto, Professor current) {
        fetchSubjects(dto.subjectIds(), current);
        fetchResources(dto.resourceIds(), current);
    }

    private void fetchSubjects(Set<Long> subjectIds, Professor professor) {
        if (subjectIds == null) return;

        Set<Subject> subjects = subjectIds.stream()
                .map(id -> subjectRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Subject with ID " + id + " not found")
                        )
                )
                .collect(Collectors.toSet());

        professor.setSubjects(subjects);

        for (Subject subject : subjects) {
            subject.getProfessors().add(professor);
        }
    }

    private void fetchResources(Set<Long> resourceIds, Professor professor) {
        if (resourceIds == null) return;

        Set<Resource> resources = resourceIds.stream()
                .map(id -> resourceRepository.findById(id)
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Resource with ID " + id + " not found")
                    )
                )
                .collect(Collectors.toSet());

        professor.setResources(resources);

        for (Resource resource : resources) {
            resource.getManagedBy().add(professor);
        }
    }
}