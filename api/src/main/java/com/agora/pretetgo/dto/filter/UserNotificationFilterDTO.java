package com.agora.pretetgo.dto.filter;

import io.swagger.v3.oas.annotations.Parameter;

import java.time.Instant;

public record UserNotificationFilterDTO(
        @Parameter(description = "ID") Long id,
        @Parameter(description = "Notification ID") Long notificationId,
        @Parameter(description = "User ID") Long userId,
        @Parameter(description = "Read timestamp") Instant readAt,
        @Parameter(description = "Is the notification read?") Boolean isRead
) {}