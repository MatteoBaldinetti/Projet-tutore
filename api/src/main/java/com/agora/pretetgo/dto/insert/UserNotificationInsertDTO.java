package com.agora.pretetgo.dto.insert;

import java.time.Instant;

public record UserNotificationInsertDTO(
        Long notificationId,
        Long userId,
        Boolean isRead,
        Instant readAt
) {
}
