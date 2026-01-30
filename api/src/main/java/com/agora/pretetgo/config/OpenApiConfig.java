package com.agora.pretetgo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration // Loaded once at startup to configure OpenAPI metadata
public class OpenApiConfig {

    @Bean // Creates a single OpenAPI definition used by Swagger UI
    public OpenAPI apiKeyOpenAPI() {
        return new OpenAPI()
                .components(new Components()
                        // Define an API key security scheme for documentation
                        .addSecuritySchemes("ApiKeyAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.APIKEY)
                                        .in(SecurityScheme.In.HEADER) // API key is expected in request headers
                                        .name("X-API-KEY") // Header name of the API key
                        )
                )
                // Apply the API key requirement globally to all endpoints
                .addSecurityItem(new SecurityRequirement().addList("ApiKeyAuth"));
    }
}