package com.agora.pretetgo.dto.response;

import java.time.Instant;

public record UserNotificationResponseDTO(
        Long id,
        Long notificationId,
        Long userId,
        Boolean isRead,
        Instant readAt
) {
}
