package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.insert.UserNotificationDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.UserNotificationMapper;
import com.agora.pretetgo.models.Notification;
import com.agora.pretetgo.models.UserNotification;
import com.agora.pretetgo.repositories.UserNotificationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserNotificationService {
    @Autowired
    private UserNotificationRepository userNotificationRepository;

    @Autowired
    private UserNotificationMapper userNotificationMapper;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public UserNotification createUserNotification(UserNotificationDTO dto) {
        UserNotification userNotification = userNotificationMapper.toEntity(dto);
        setNotification(dto, userNotification);
        return userNotificationRepository.save(userNotification);
    }

    @Transactional
    public UserNotification getUserNotificationById(Long id) {
        return userNotificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserNotification with ID " + id + " not found"));
    }

    @Transactional
    public List<UserNotification> getAllUserNotifications() {
        return userNotificationRepository.findAll();
    }

    @Transactional
    public UserNotification updateUserNotification(Long id, UserNotificationDTO dto) {
        UserNotification current = getUserNotificationById(id);
        userNotificationMapper.updateUserNotificationFromDto(dto, current);
        setNotification(dto, current);
        return userNotificationRepository.save(current);
    }

    @Transactional
    public void deleteUserNotification(Long id) {
        userNotificationRepository.deleteById(getUserNotificationById(id).getId());
    }

    @Transactional
    public UserNotification patchUserNotification(Long id, UserNotificationDTO dto) {
        UserNotification current = getUserNotificationById(id);
        userNotificationMapper.patchUserNotificationFromDto(dto, current);
        setNotification(dto, current);
        return userNotificationRepository.save(current);
    }

    private void setNotification(UserNotificationDTO dto, UserNotification current) {
        if (dto.notificationId() != null) {
            Notification notification = notificationService.getNotificationById(dto.notificationId());
            current.setNotification(notification);
        }
    }
}