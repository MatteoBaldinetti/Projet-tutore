package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.ClassroomInsertDTO;
import com.agora.pretetgo.dto.response.ClassroomResponseDTO;
import com.agora.pretetgo.models.Classroom;
import com.agora.pretetgo.models.ClassroomType;
import com.agora.pretetgo.models.FileMetaData;
import com.agora.pretetgo.models.Professor;
import org.mapstruct.*;
@Mapper(componentModel = "spring")
public interface ClassroomMapper {
    @Mapping(target = "managedBy", source = "managedById")
    @Mapping(target = "image", source = "imageId")
    @Mapping(target = "model3d", source = "model3dId")
    @Mapping(target = "classroomType", source = "classroomTypeId")
    Classroom toEntity(ClassroomInsertDTO dto);

    @Mapping(target = "managedById", source = "managedBy")
    @Mapping(target = "imageId", source = "image")
    @Mapping(target = "model3dId", source = "model3d")
    @Mapping(target = "classroomTypeId", source = "classroomType")
    ClassroomResponseDTO toResponseDTO(Classroom classroom);

    @Mapping(target = "managedBy", source = "managedById")
    @Mapping(target = "image", source = "imageId")
    @Mapping(target = "model3d", source = "model3dId")
    @Mapping(target = "classroomType", source = "classroomTypeId")
    void updateClassroomFromDto(ClassroomInsertDTO dto, @MappingTarget Classroom classroom);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "managedBy", source = "managedById")
    @Mapping(target = "image", source = "imageId")
    @Mapping(target = "model3d", source = "model3dId")
    @Mapping(target = "classroomType", source = "classroomTypeId")
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

    default ClassroomType mapClassroomType(Long id) {
        if (id == null) return null;
        ClassroomType classroomType = new ClassroomType();
        classroomType.setId(id);
        return classroomType;
    }

    default Long mapProfessorId(Professor professor) {
        return professor == null ? null : professor.getId();
    }

    default Long mapFileMetaDataId(FileMetaData fileMetaData) {
        return fileMetaData == null ? null : fileMetaData.getId();
    }

    default Long mapClassroomTypeId(ClassroomType classroomType) {
        return classroomType == null ? null : classroomType.getId();
    }
}
