package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.filter.UserNotificationFilterDTO;
import com.agora.pretetgo.dto.insert.UserNotificationInsertDTO;
import com.agora.pretetgo.dto.response.UserNotificationResponseDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.UserNotificationMapper;
import com.agora.pretetgo.models.Notification;
import com.agora.pretetgo.models.User;
import com.agora.pretetgo.models.UserNotification;
import com.agora.pretetgo.repositories.UserNotificationRepository;
import com.agora.pretetgo.specifications.UserNotificationSpecification;
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

    @Autowired
    private UserService userService;

    @Transactional
    public UserNotification createUserNotification(UserNotificationInsertDTO dto) {
        UserNotification userNotification = userNotificationMapper.toEntity(dto);
        mapDTOIds(dto, userNotification);
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
    public UserNotification updateUserNotification(Long id, UserNotificationInsertDTO dto) {
        UserNotification current = getUserNotificationById(id);
        userNotificationMapper.updateUserNotificationFromDto(dto, current);
        mapDTOIds(dto, current);
        return userNotificationRepository.save(current);
    }

    @Transactional
    public void deleteUserNotification(Long id) {
        userNotificationRepository.deleteById(getUserNotificationById(id).getId());
    }

    @Transactional
    public UserNotification patchUserNotification(Long id, UserNotificationInsertDTO dto) {
        UserNotification current = getUserNotificationById(id);
        userNotificationMapper.patchUserNotificationFromDto(dto, current);
        mapDTOIds(dto, current);
        return userNotificationRepository.save(current);
    }

    @Transactional
    public List<UserNotificationResponseDTO> searchUserNotifications(UserNotificationFilterDTO filterDTO) {
        return userNotificationRepository.findAll(
                        UserNotificationSpecification.withFilter(filterDTO)
                )
                .stream()
                .map(userNotificationMapper::toResponseDTO)
                .toList();
    }

    private void mapDTOIds(UserNotificationInsertDTO dto, UserNotification current) {
        setNotification(dto, current);
        setUser(dto, current);
    }

    private void setNotification(UserNotificationInsertDTO dto, UserNotification current) {
        if (dto.notificationId() != null) {
            Notification notification = notificationService.getNotificationById(dto.notificationId());
            current.setNotification(notification);
        }
    }

    private void setUser(UserNotificationInsertDTO dto, UserNotification current) {
        if (dto.userId() != null) {
            User user = userService.getUserById(dto.userId());
            current.setUser(user);
        }
    }
}