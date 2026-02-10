package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.ProfessorDTO;
import com.agora.pretetgo.dto.response.ProfessorResponseDTO;
import com.agora.pretetgo.models.Professor;
import com.agora.pretetgo.models.Subject;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ProfessorMapper {
    @Mapping(target = "subjects", source = "subjectIds")
    Professor toEntity(ProfessorDTO dto);

    @Mapping(target = "subjectIds", source = "subjects")
    ProfessorResponseDTO toResponseDTO(Professor professor);

    @Mapping(target = "subjects", source = "subjectIds")
    void updateProfessorFromDto(ProfessorDTO dto, @MappingTarget Professor Professor);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "subjects", source = "subjectIds")
    void patchProfessorFromDto(ProfessorDTO dto, @MappingTarget Professor Professor);

    default Subject mapSubject(Long id) {
        if (id == null) return null;
        Subject subject = new Subject();
        subject.setId(id);
        return subject;
    }

    default Long mapSubjectId(Subject subject) {
        return subject == null ? null : subject.getId();
    }
}
