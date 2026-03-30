package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.TagInsertDTO;
import com.agora.pretetgo.dto.response.TagResponseDTO;
import com.agora.pretetgo.models.Resource;
import com.agora.pretetgo.models.Tag;
import com.agora.pretetgo.models.Professor;
import com.agora.pretetgo.services.ResourceService;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class TagMapper {
    @Autowired
    private ResourceService resourceService;

    @Mapping(target = "resources", source = "resourceIds")
    @Mapping(target = "createdBy", source = "createdById")
    public abstract Tag toEntity(TagInsertDTO dto);

    @Mapping(target = "resourceIds", source = "resources")
    @Mapping(target = "createdById", source = "createdBy")
    public abstract TagResponseDTO toResponseDTO(Tag item);

    @Mapping(target = "createdBy", source = "createdById")
    @Mapping(target = "resources", source = "resourceIds")
    public abstract void updateTagFromDto(TagInsertDTO dto, @MappingTarget Tag Tag);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "resources", source = "resourceIds")
    @Mapping(target = "createdBy", source = "createdById")
    public abstract void patchTagFromDto(TagInsertDTO dto, @MappingTarget Tag Tag);

    protected Professor mapProfessor(Long id) {
        if (id == null) return null;
        Professor professor = new Professor();
        professor.setId(id);
        return professor;
    }

    protected Resource mapResource(Long id) {
        return id == null ? null : resourceService.getResourceById(id);
    }

    protected Long mapProfessorId(Professor professor) {
        return professor == null ? null : professor.getId();
    }

    protected Long mapResourceId(Resource resource) {
        return resource == null ? null : resource.getId();
    }
}
