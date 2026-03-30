package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.response.FileMetaDataResponseDTO;
import com.agora.pretetgo.dto.insert.FileMetaDataInsertDTO;
import com.agora.pretetgo.models.FileMetaData;
import com.agora.pretetgo.models.Resource;
import com.agora.pretetgo.services.ResourceService;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class FileMetaDataMapper {

    @Autowired
    protected ResourceService resourceService;

    @Mapping(target = "resourcesImages", source = "resourcesImageIds")
    public abstract FileMetaData toEntity(FileMetaDataInsertDTO dto);

    @Mapping(target = "resourcesImageIds", source = "resourcesImages")
    public abstract FileMetaDataResponseDTO toResponseDTO(FileMetaData fileMetaData);

    @Mapping(target = "resourcesImages", source = "resourcesImageIds")
    public abstract void updateFileMetaDataFromDto(FileMetaDataInsertDTO dto, @MappingTarget FileMetaData fileMetaData);

    @Mapping(target = "resourcesImages", source = "resourcesImageIds")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract void patchFileMetaDataFromDto(FileMetaDataInsertDTO dto, @MappingTarget FileMetaData fileMetaData);

    protected Resource mapResource(Long id) {
        return id == null ? null : resourceService.getResourceById(id);
    }

    protected Long mapResourceId(Resource resource) {
        return resource == null ? null : resource.getId();
    }
}
