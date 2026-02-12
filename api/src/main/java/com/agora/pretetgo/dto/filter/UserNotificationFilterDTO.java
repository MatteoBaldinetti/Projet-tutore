package com.agora.pretetgo.dto.filter;

import java.time.Instant;

public record UserNotificationFilterDTO(
        Long id,
        Long notificationId,
        Long userId,
        Instant readAt,
        Boolean isRead
) {
}
