package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.insert.SubjectDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.SubjectMapper;
import com.agora.pretetgo.models.Professor;
import com.agora.pretetgo.models.Subject;
import com.agora.pretetgo.repositories.ProfessorRepository;
import com.agora.pretetgo.repositories.SubjectRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SubjectService {
    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private SubjectMapper subjectMapper;

    @Autowired
    private ProfessorRepository professorRepository;

    @Transactional
    public Subject createSubject(SubjectDTO dto) {
        Subject subject = subjectMapper.toEntity(dto);
        fetchProfessors(dto.professorIds(), subject);
        return subjectRepository.save(subject);
    }

    @Transactional
    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject with ID " + id + " not found"));
    }

    @Transactional
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    @Transactional
    public Subject updateSubject(Long id, SubjectDTO dto) {
        Subject current = getSubjectById(id);
        subjectMapper.updateSubjectFromDto(dto, current);
        fetchProfessors(dto.professorIds(), current);
        return subjectRepository.save(current);
    }

    @Transactional
    public void deleteSubject(Long id) {
        subjectRepository.deleteById(getSubjectById(id).getId());
    }

    @Transactional
    public Subject patchSubject(Long id, SubjectDTO dto) {
        Subject current = getSubjectById(id);
        subjectMapper.patchSubjectFromDto(dto, current);
        fetchProfessors(dto.professorIds(), current);
        return subjectRepository.save(current);
    }

    private void fetchProfessors(Set<Long> ProfessorIds, Subject subject) {
        if (ProfessorIds == null) return;

        Set<Professor> professors = ProfessorIds.stream()
                .map(id -> professorRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException("Professor with ID " + id + " not found")
                        )
                )
                .collect(Collectors.toSet());

        subject.setProfessors(professors);
    }

}