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
        @JsonSubTypes.Type(value = ClassroomResponseDTO.class, name = "CLASSROOM"),
        @JsonSubTypes.Type(value = ItemResponseDTO.class, name = "ITEM"),
})
public sealed interface ResourceResponseDTO permits ClassroomResponseDTO, ItemResponseDTO {
    Long id();
    String name();
    String description();
    Long managedById();
    Boolean available();
    Long imageId();
    Long model3dId();
    Instant createdAt();
}