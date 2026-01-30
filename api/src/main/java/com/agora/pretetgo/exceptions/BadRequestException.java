package com.agora.pretetgo.exceptions;

// Thrown when client input is invalid (maps to HTTP 400)
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}

