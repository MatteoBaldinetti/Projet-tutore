package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.UserNotificationDTO;
import com.agora.pretetgo.dto.response.UserNotificationResponseDTO;
import com.agora.pretetgo.models.Notification;
import com.agora.pretetgo.models.User;
import com.agora.pretetgo.models.UserNotification;
import com.agora.pretetgo.services.UserService;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class UserNotificationMapper {
    @Autowired
    private UserService userService;

    @Mapping(target = "notification", source = "notificationId")
    @Mapping(target = "user", source = "userId")
    public abstract UserNotification toEntity(UserNotificationDTO dto);

    @Mapping(target = "notificationId", source = "notification")
    @Mapping(target = "userId", source = "user")
    public abstract UserNotificationResponseDTO toResponseDTO(UserNotification userNotification);

    @Mapping(target = "notification", source = "notificationId")
    @Mapping(target = "user", source = "userId")
    public abstract void updateUserNotificationFromDto(UserNotificationDTO dto, @MappingTarget UserNotification UserNotification);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "notification", source = "notificationId")
    @Mapping(target = "user", source = "userId")
    public abstract void patchUserNotificationFromDto(UserNotificationDTO dto, @MappingTarget UserNotification UserNotification);

    protected Notification mapNotification(Long id) {
        if (id == null) return null;
        Notification notification = new Notification();
        notification.setId(id);
        return notification;
    }

    protected User mapUser(Long id) {
        return id == null ? null : userService.getUserById(id);
    }

    protected Long mapNotificationId(Notification notification) {
        return notification == null ? null : notification.getId();
    }

    protected Long mapUserId(User user) {
        return user == null ? null : user.getId();
    }
}