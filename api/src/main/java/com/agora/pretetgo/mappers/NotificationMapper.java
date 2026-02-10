package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.NotificationDTO;
import com.agora.pretetgo.dto.response.NotificationResponseDTO;
import com.agora.pretetgo.models.Notification;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    Notification toEntity(NotificationDTO dto);

    NotificationResponseDTO toResponseDTO(Notification notification);

    void updateNotificationFromDto(NotificationDTO dto, @MappingTarget Notification Notification);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchNotificationFromDto(NotificationDTO dto, @MappingTarget Notification Notification);

}
