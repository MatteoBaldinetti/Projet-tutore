package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.response.NotificationResponseDTO;
import com.agora.pretetgo.dto.insert.NotificationInsertDTO;
import com.agora.pretetgo.models.Notification;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    Notification toEntity(NotificationInsertDTO dto);

    NotificationResponseDTO toResponseDTO(Notification notification);

    void updateNotificationFromDto(NotificationInsertDTO dto, @MappingTarget Notification Notification);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchNotificationFromDto(NotificationInsertDTO dto, @MappingTarget Notification Notification);

}
