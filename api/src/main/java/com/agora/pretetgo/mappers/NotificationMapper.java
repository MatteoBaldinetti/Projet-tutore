package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.response.NotificationResponseDTO;
import com.agora.pretetgo.dto.insert.NotificationInsertDTO;
import com.agora.pretetgo.models.FileMetaData;
import com.agora.pretetgo.models.Notification;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NotificationMapper {
    @Mapping(target = "image", source = "imageId")
    Notification toEntity(NotificationInsertDTO dto);

    @Mapping(target = "imageId", source = "image")
    NotificationResponseDTO toResponseDTO(Notification notification);

    @Mapping(target = "image", source = "imageId")
    void updateNotificationFromDto(NotificationInsertDTO dto, @MappingTarget Notification Notification);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "image", source = "imageId")
    void patchNotificationFromDto(NotificationInsertDTO dto, @MappingTarget Notification Notification);

    default FileMetaData mapFileMetaData(Long id) {
        if (id == null) return null;
        FileMetaData fileMetaData = new FileMetaData();
        fileMetaData.setId(id);
        return fileMetaData;
    }

    default Long mapFileMetaDataId(FileMetaData fileMetaData) {
        return fileMetaData == null ? null : fileMetaData.getId();
    }
    
}
