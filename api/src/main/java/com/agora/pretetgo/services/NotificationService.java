package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.insert.NotificationDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.NotificationMapper;
import com.agora.pretetgo.models.Notification;
import com.agora.pretetgo.repositories.NotificationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationMapper notificationMapper;

    @Transactional
    public Notification createNotification(NotificationDTO dto) {
        Notification notification = notificationMapper.toEntity(dto);
        return notificationRepository.save(notification);
    }

    @Transactional
    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification with ID " + id + " not found"));
    }

    @Transactional
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @Transactional
    public Notification updateNotification(Long id, NotificationDTO dto) {
        Notification current = getNotificationById(id);
        notificationMapper.updateNotificationFromDto(dto, current);
        return notificationRepository.save(current);
    }

    @Transactional
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(getNotificationById(id).getId());
    }

    @Transactional
    public Notification patchNotification(Long id, NotificationDTO dto) {
        Notification current = getNotificationById(id);
        notificationMapper.patchNotificationFromDto(dto, current);
        return notificationRepository.save(current);
    }
}