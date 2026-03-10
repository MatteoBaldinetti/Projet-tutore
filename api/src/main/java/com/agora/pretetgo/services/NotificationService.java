package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.filter.NotificationFilterDTO;
import com.agora.pretetgo.dto.insert.NotificationInsertDTO;
import com.agora.pretetgo.dto.response.NotificationResponseDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.NotificationMapper;
import com.agora.pretetgo.models.FileMetaData;
import com.agora.pretetgo.models.Notification;
import com.agora.pretetgo.repositories.NotificationRepository;
import com.agora.pretetgo.specifications.NotificationSpecification;
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

    @Autowired
    private FileMetaDataService fileMetaDataService;

    @Transactional
    public Notification createNotification(NotificationInsertDTO dto) {
        Notification notification = notificationMapper.toEntity(dto);
        mapDTOIds(dto, notification);
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
    public Notification updateNotification(Long id, NotificationInsertDTO dto) {
        Notification current = getNotificationById(id);
        notificationMapper.updateNotificationFromDto(dto, current);
        mapDTOIds(dto, current);
        return notificationRepository.save(current);
    }

    @Transactional
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(getNotificationById(id).getId());
    }

    @Transactional
    public Notification patchNotification(Long id, NotificationInsertDTO dto) {
        Notification current = getNotificationById(id);
        notificationMapper.patchNotificationFromDto(dto, current);
        mapDTOIds(dto, current);
        return notificationRepository.save(current);
    }

    @Transactional
    public List<NotificationResponseDTO> searchNotifications(NotificationFilterDTO filterDTO) {
        return notificationRepository.findAll(
                        NotificationSpecification.withFilter(filterDTO)
                )
                .stream()
                .map(notificationMapper::toResponseDTO)
                .toList();
    }

    private void mapDTOIds(NotificationInsertDTO dto, Notification current) {
        setImage(dto, current);
    }

    private void setImage(NotificationInsertDTO dto, Notification current) {
        if (dto.imageId() != null) {
            FileMetaData image = fileMetaDataService.getFileMetaDataById(dto.imageId());
            current.setImage(image);
        }
    }
}