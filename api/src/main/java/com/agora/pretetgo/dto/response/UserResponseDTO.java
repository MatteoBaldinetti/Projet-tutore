package com.agora.pretetgo.dto.response;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import java.time.Instant;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "type"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = StudentResponseDTO.class, name = "STUDENT"),
        @JsonSubTypes.Type(value = ProfessorResponseDTO.class, name = "PROFESSOR"),
        @JsonSubTypes.Type(value = AdminResponseDTO.class, name = "ADMIN")
})
public sealed interface UserResponseDTO permits AdminResponseDTO, StudentResponseDTO, ProfessorResponseDTO {
    Long id();
    String firstName();
    String lastName();
    String email();
    String password();
    Instant createdAt();
    Boolean enabled();
}
