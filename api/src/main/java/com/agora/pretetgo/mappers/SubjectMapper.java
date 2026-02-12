package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.SubjectInsertDTO;
import com.agora.pretetgo.dto.response.SubjectResponseDTO;
import com.agora.pretetgo.models.Professor;
import com.agora.pretetgo.models.Subject;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SubjectMapper {
    @Mapping(target = "professors", source = "professorIds")
    Subject toEntity(SubjectInsertDTO dto);

    @Mapping(target = "professorIds", source = "professors")
    SubjectResponseDTO toResponseDTO(Subject subject);

    @Mapping(target = "professors", source = "professorIds")
    void updateSubjectFromDto(SubjectInsertDTO dto, @MappingTarget Subject Subject);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "professors", source = "professorIds")
    void patchSubjectFromDto(SubjectInsertDTO dto, @MappingTarget Subject Subject);

    default Professor mapProfessor(Long id) {
        if (id == null) return null;
        Professor professor = new Professor();
        professor.setId(id);
        return professor;
    }

    default Long mapProfessorId(Professor professor) {
        return professor == null ? null : professor.getId();
    }
}
