package com.agora.pretetgo.filter;

import com.agora.pretetgo.exceptions.ApiError;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class ApiKeyFilter extends OncePerRequestFilter {

    private final String apiKey;
    private final ObjectMapper objectMapper;

    public ApiKeyFilter(String apiKey, ObjectMapper objectMapper) {
        this.apiKey = apiKey;
        this.objectMapper = objectMapper;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Skip non-API endpoints, CORS preflight requests, and public downloads
        return !request.getRequestURI().startsWith("/api/") ||
                "OPTIONS".equalsIgnoreCase(request.getMethod()) ||
                request.getRequestURI().startsWith("/api/files/download");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws IOException, ServletException {

        String requestApiKey = request.getHeader("X-API-KEY");

        // Validate API key before allowing the request to proceed
        if (apiKey.equals(requestApiKey)) {
            filterChain.doFilter(request, response);
        } else {
            ApiError error = ApiError.of(HttpServletResponse.SC_UNAUTHORIZED, "Invalid API Key");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(objectMapper.writeValueAsString(error));
        }
    }
}