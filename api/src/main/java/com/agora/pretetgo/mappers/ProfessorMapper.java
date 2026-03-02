package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.response.ProfessorResponseDTO;
import com.agora.pretetgo.dto.insert.ProfessorInsertDTO;
import com.agora.pretetgo.models.Professor;
import com.agora.pretetgo.models.Resource;
import com.agora.pretetgo.models.Subject;
import com.agora.pretetgo.services.ResourceService;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class ProfessorMapper {

    @Autowired
    protected ResourceService resourceService;

    @Mapping(target = "subjects", source = "subjectIds")
    @Mapping(target = "resources", source = "resourceIds")
    public abstract Professor toEntity(ProfessorInsertDTO dto);

    @Mapping(target = "subjectIds", source = "subjects")
    @Mapping(target = "resourceIds", source = "resources")
    public abstract ProfessorResponseDTO toResponseDTO(Professor professor);

    @Mapping(target = "subjects", source = "subjectIds")
    @Mapping(target = "resources", source = "resourceIds")
    public abstract void updateProfessorFromDto(ProfessorInsertDTO dto, @MappingTarget Professor Professor);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "subjects", source = "subjectIds")
    @Mapping(target = "resources", source = "resourceIds")
    public abstract void patchProfessorFromDto(ProfessorInsertDTO dto, @MappingTarget Professor Professor);

    protected Subject mapSubject(Long id) {
        if (id == null) return null;
        Subject subject = new Subject();
        subject.setId(id);
        return subject;
    }

    protected Resource mapResource(Long id) {
        return id == null ? null : resourceService.getResourceById(id);
    }

    protected Long mapSubjectId(Subject subject) {
        return subject == null ? null : subject.getId();
    }

    protected Long mapResourceId(Resource resource) {
        return resource == null ? null : resource.getId();
    }
}
