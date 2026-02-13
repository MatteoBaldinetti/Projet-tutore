package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.response.ResourceResponseDTO;
import com.agora.pretetgo.models.Classroom;
import com.agora.pretetgo.models.Item;
import com.agora.pretetgo.models.Resource;
import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class ResourceMapper {
    @Autowired
    protected ClassroomMapper classroomMapper;

    @Autowired
    protected ItemMapper itemMapper;

    public ResourceResponseDTO toResponseDTO(Resource resource) {
        if (resource instanceof Classroom c) {
            return classroomMapper.toResponseDTO(c);
        }
        if (resource instanceof Item i) {
            return itemMapper.toResponseDTO(i);
        }

        throw new IllegalArgumentException("Unknown resource type: " + resource.getClass().getName());
    }
}