package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.ClassroomInsertDTO;
import com.agora.pretetgo.dto.response.ClassroomResponseDTO;
import com.agora.pretetgo.models.Classroom;
import com.agora.pretetgo.models.FileMetaData;
import com.agora.pretetgo.models.Professor;
import org.mapstruct.*;
@Mapper(componentModel = "spring")
public interface ClassroomMapper {
    @Mapping(target = "managedBy", source = "managedById")
    @Mapping(target = "image", source = "imageId")
    @Mapping(target = "model3d", source = "model3dId")
    Classroom toEntity(ClassroomInsertDTO dto);

    @Mapping(target = "managedById", source = "managedBy")
    @Mapping(target = "imageId", source = "image")
    @Mapping(target = "model3dId", source = "model3d")
    ClassroomResponseDTO toResponseDTO(Classroom classroom);

    @Mapping(target = "managedBy", source = "managedById")
    @Mapping(target = "image", source = "imageId")
    @Mapping(target = "model3d", source = "model3dId")
    void updateClassroomFromDto(ClassroomInsertDTO dto, @MappingTarget Classroom classroom);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "managedBy", source = "managedById")
    @Mapping(target = "image", source = "imageId")
    @Mapping(target = "model3d", source = "model3dId")
    void patchClassroomFromDto(ClassroomInsertDTO dto, @MappingTarget Classroom classroom);

    default Professor mapProfessor(Long id) {
        if (id == null) return null;
        Professor professor = new Professor();
        professor.setId(id);
        return professor;
    }

    default FileMetaData mapFileMetaData(Long id) {
        if (id == null) return null;
        FileMetaData fileMetaData = new FileMetaData();
        fileMetaData.setId(id);
        return fileMetaData;
    }

    default Long mapProfessorId(Professor professor) {
        return professor == null ? null : professor.getId();
    }

    default Long mapFileMetaDataId(FileMetaData fileMetaData) {
        return fileMetaData == null ? null : fileMetaData.getId();
    }
}
