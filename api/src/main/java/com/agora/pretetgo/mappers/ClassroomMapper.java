package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.ClassroomInsertDTO;
import com.agora.pretetgo.dto.response.ClassroomResponseDTO;
import com.agora.pretetgo.models.Classroom;
import com.agora.pretetgo.models.Professor;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ClassroomMapper {
    @Mapping(target = "managedBy", source = "managedById")
    Classroom toEntity(ClassroomInsertDTO dto);

    @Mapping(target = "managedById", source = "managedBy")
    ClassroomResponseDTO toResponseDTO(Classroom classroom);

    @Mapping(target = "managedBy", source = "managedById")
    void updateClassroomFromDto(ClassroomInsertDTO dto, @MappingTarget Classroom classroom);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "managedBy", source = "managedById")
    void patchClassroomFromDto(ClassroomInsertDTO dto, @MappingTarget Classroom classroom);

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
