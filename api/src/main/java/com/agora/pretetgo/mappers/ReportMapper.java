package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.ReportInsertDTO;
import com.agora.pretetgo.dto.response.ReportResponseDTO;
import com.agora.pretetgo.models.FileMetaData;
import com.agora.pretetgo.models.Report;
import com.agora.pretetgo.models.Resource;
import com.agora.pretetgo.models.User;
import com.agora.pretetgo.services.ResourceService;
import com.agora.pretetgo.services.UserService;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class ReportMapper {

    @Autowired
    protected ResourceService resourceService;

    @Autowired
    protected UserService userService;

    @Mapping(target = "resource", source = "resourceId")
    @Mapping(target = "reportedBy", source = "reportedById")
    @Mapping(target = "image", source = "imageId")
    public abstract Report toEntity(ReportInsertDTO dto);

    @Mapping(target = "resourceId", source = "resource")
    @Mapping(target = "reportedById", source = "reportedBy")
    @Mapping(target = "imageId", source = "image")
    public abstract ReportResponseDTO toResponseDTO(Report report);

    @Mapping(target = "resource", source = "resourceId")
    @Mapping(target = "reportedBy", source = "reportedById")
    @Mapping(target = "image", source = "imageId")
    public abstract void updateReportFromDto(ReportInsertDTO dto, @MappingTarget Report Report);

    @Mapping(target = "resource", source = "resourceId")
    @Mapping(target = "reportedBy", source = "reportedById")
    @Mapping(target = "image", source = "imageId")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract void patchReportFromDto(ReportInsertDTO dto, @MappingTarget Report Report);

    protected Resource mapResource(Long id) {
        return id == null ? null : resourceService.getResourceById(id);
    }

    protected User mapUser(Long id) {
        return id == null ? null : userService.getUserById(id);
    }

    protected FileMetaData mapFileMetaData(Long id) {
        if (id == null) return null;
        FileMetaData fileMetaData = new FileMetaData();
        fileMetaData.setId(id);
        return fileMetaData;
    }

    protected Long mapResourceId(Resource resource) {
        return resource == null ? null : resource.getId();
    }

    protected Long mapUserId(User user) {
        return user == null ? null : user.getId();
    }

    protected Long mapFileMetaDataId(FileMetaData fileMetaData) {
        return fileMetaData == null ? null : fileMetaData.getId();
    }
}
