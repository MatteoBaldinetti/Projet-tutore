package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.response.ResourceResponseDTO;
import com.agora.pretetgo.models.Resource;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ResourceMapper {
    ResourceResponseDTO toResponseDTO(Resource resource);
}
