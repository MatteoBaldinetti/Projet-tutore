package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.ItemTypeDTO;
import com.agora.pretetgo.dto.response.ItemTypeResponseDTO;
import com.agora.pretetgo.models.ItemType;
import com.agora.pretetgo.models.Professor;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ItemTypeMapper {
    @Mapping(target = "createdBy", source = "createdById")
    ItemType toEntity(ItemTypeDTO dto);

    @Mapping(target = "createdById", source = "createdBy")
    ItemTypeResponseDTO toResponseDTO(ItemType item);

    @Mapping(target = "createdBy", source = "createdById")
    void updateItemTypeFromDto(ItemTypeDTO dto, @MappingTarget ItemType ItemType);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "createdBy", source = "createdById")
    void patchItemTypeFromDto(ItemTypeDTO dto, @MappingTarget ItemType ItemType);

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
