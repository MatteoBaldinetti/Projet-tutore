package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.ItemDTO;
import com.agora.pretetgo.dto.response.ItemResponseDTO;
import com.agora.pretetgo.models.Item;
import com.agora.pretetgo.models.ItemType;
import com.agora.pretetgo.models.Professor;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ItemMapper {
    @Mapping(target = "managedBy", source = "managedById")
    @Mapping(target = "type", source = "typeId")
    Item toEntity(ItemDTO dto);

    @Mapping(target = "managedById", source = "managedBy")
    @Mapping(target = "typeId", source = "type")
    ItemResponseDTO toResponseDTO(Item item);

    @Mapping(target = "managedBy", source = "managedById")
    @Mapping(target = "type", source = "typeId")
    void updateItemFromDto(ItemDTO dto, @MappingTarget Item Item);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "managedBy", source = "managedById")
    @Mapping(target = "type", source = "typeId")
    void patchItemFromDto(ItemDTO dto, @MappingTarget Item Item);

    default Professor mapProfessor(Long id) {
        if (id == null) return null;
        Professor professor = new Professor();
        professor.setId(id);
        return professor;
    }

    default ItemType mapItemType(Long id) {
        if (id == null) return null;
        ItemType itemType = new ItemType();
        itemType.setId(id);
        return itemType;
    }

    default Long mapProfessorId(Professor professor) {
        return professor == null ? null : professor.getId();
    }

    default Long mapItemTypeId(ItemType itemType) {
        return itemType == null ? null : itemType.getId();
    }
}
