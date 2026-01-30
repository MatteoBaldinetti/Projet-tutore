package com.agora.pretetgo.exceptions;

// Thrown when the API key is invalid (maps to HTTP 401)
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
