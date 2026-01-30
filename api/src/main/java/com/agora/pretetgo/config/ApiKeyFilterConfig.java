package com.agora.pretetgo.config;

import com.agora.pretetgo.filter.ApiKeyFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration // Loaded once at application startup to define beans
public class ApiKeyFilterConfig {

    @Value("${api.key}") // Injected once from application properties at startup
    private String apiKey;

    @Bean // Executed once at startup to register the filter
    public FilterRegistrationBean<ApiKeyFilter> apiKeyFilter(
            ObjectMapper objectMapper
    ) {
        FilterRegistrationBean<ApiKeyFilter> registration = new FilterRegistrationBean<>();

        // Single filter instance reused for all matching requests
        registration.setFilter(new ApiKeyFilter(apiKey, objectMapper));

        // Apply filter to all /api/* endpoints
        registration.addUrlPatterns("/api/*");

        // Lower value = earlier execution in the servlet filter chain
        registration.setOrder(1);

        return registration;
    }
}