package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.ItemInsertDTO;
import com.agora.pretetgo.dto.response.ItemResponseDTO;
import com.agora.pretetgo.models.FileMetaData;
import com.agora.pretetgo.models.Item;
import com.agora.pretetgo.models.ItemType;
import com.agora.pretetgo.models.Professor;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ItemMapper {
    @Mapping(target = "managedBy", source = "managedById")
    @Mapping(target = "itemType", source = "itemTypeId")
    @Mapping(target = "image", source = "imageId")
    @Mapping(target = "model3d", source = "model3dId")
    @Mapping(target = "usagePdf", source = "usagePdfId")
    Item toEntity(ItemInsertDTO dto);

    @Mapping(target = "managedById", source = "managedBy")
    @Mapping(target = "itemTypeId", source = "itemType")
    @Mapping(target = "imageId", source = "image")
    @Mapping(target = "model3dId", source = "model3d")
    @Mapping(target = "usagePdfId", source = "usagePdf")
    ItemResponseDTO toResponseDTO(Item item);

    @Mapping(target = "managedBy", source = "managedById")
    @Mapping(target = "itemType", source = "itemTypeId")
    @Mapping(target = "image", source = "imageId")
    @Mapping(target = "model3d", source = "model3dId")
    @Mapping(target = "usagePdf", source = "usagePdfId")
    void updateItemFromDto(ItemInsertDTO dto, @MappingTarget Item Item);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "managedBy", source = "managedById")
    @Mapping(target = "itemType", source = "itemTypeId")
    @Mapping(target = "image", source = "imageId")
    @Mapping(target = "model3d", source = "model3dId")
    @Mapping(target = "usagePdf", source = "usagePdfId")
    void patchItemFromDto(ItemInsertDTO dto, @MappingTarget Item Item);

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

    default FileMetaData mapFileMetaData(Long id) {
        if (id == null) return null;
        FileMetaData fileMetaData = new FileMetaData();
        fileMetaData.setId(id);
        return fileMetaData;
    }

    default Long mapProfessorId(Professor professor) {
        return professor == null ? null : professor.getId();
    }

    default Long mapItemTypeId(ItemType itemType) {
        return itemType == null ? null : itemType.getId();
    }

    default Long mapFileMetaDataId(FileMetaData fileMetaData) {
        return fileMetaData == null ? null : fileMetaData.getId();
    }
}
