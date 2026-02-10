package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record UserNotificationDTO(
        Long notificationId,
        Long userId,
        Instant readAt,
        Boolean isRead
) {
}
