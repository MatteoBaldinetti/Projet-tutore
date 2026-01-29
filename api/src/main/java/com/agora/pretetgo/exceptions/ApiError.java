package com.agora.pretetgo.exceptions;

import java.time.LocalDateTime;

// Standardized error payload returned by the API
public record ApiError(
        int status,
        String message,
        LocalDateTime timestamp
) {
    // Factory that autopopulates the timestamp
    public static ApiError of(int status, String message) {
        return new ApiError(status, message, LocalDateTime.now());
    }
}