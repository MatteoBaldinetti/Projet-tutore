package com.agora.pretetgo.dto.response;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;


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
}