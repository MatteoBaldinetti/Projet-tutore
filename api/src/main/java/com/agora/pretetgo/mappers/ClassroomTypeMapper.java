package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.ClassroomTypeInsertDTO;
import com.agora.pretetgo.dto.response.ClassroomTypeResponseDTO;
import com.agora.pretetgo.models.ClassroomType;
import com.agora.pretetgo.models.Professor;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ClassroomTypeMapper {
    @Mapping(target = "createdBy", source = "createdById")
    ClassroomType toEntity(ClassroomTypeInsertDTO dto);

    @Mapping(target = "createdById", source = "createdBy")
    ClassroomTypeResponseDTO toResponseDTO(ClassroomType classroom);

    @Mapping(target = "createdBy", source = "createdById")
    void updateClassroomTypeFromDto(ClassroomTypeInsertDTO dto, @MappingTarget ClassroomType ClassroomType);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "createdBy", source = "createdById")
    void patchClassroomTypeFromDto(ClassroomTypeInsertDTO dto, @MappingTarget ClassroomType ClassroomType);

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
