package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.ClassroomInsertDTO;
import com.agora.pretetgo.dto.response.ClassroomResponseDTO;
import com.agora.pretetgo.models.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ClassroomMapper {
    @Mapping(target = "managedBy", source = "managedByIds")
    @Mapping(target = "images", source = "imageIds")
    @Mapping(target = "model3d", source = "model3dId")
    @Mapping(target = "tags", source = "tagIds")
    @Mapping(target = "classroomType", source = "classroomTypeId")
    Classroom toEntity(ClassroomInsertDTO dto);

    @Mapping(target = "managedByIds", source = "managedBy")
    @Mapping(target = "imageIds", source = "images")
    @Mapping(target = "model3dId", source = "model3d")
    @Mapping(target = "tagIds", source = "tags")
    @Mapping(target = "classroomTypeId", source = "classroomType")
    ClassroomResponseDTO toResponseDTO(Classroom classroom);

    @Mapping(target = "managedBy", source = "managedByIds")
    @Mapping(target = "images", source = "imageIds")
    @Mapping(target = "model3d", source = "model3dId")
    @Mapping(target = "tags", source = "tagIds")
    @Mapping(target = "classroomType", source = "classroomTypeId")
    void updateClassroomFromDto(ClassroomInsertDTO dto, @MappingTarget Classroom classroom);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "managedBy", source = "managedByIds")
    @Mapping(target = "images", source = "imageIds")
    @Mapping(target = "model3d", source = "model3dId")
    @Mapping(target = "tags", source = "tagIds")
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

    default Tag mapTag(Long id) {
        if (id == null) return null;
        Tag tag = new Tag();
        tag.setId(id);
        return tag;
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

    default Long mapTagId(Tag tag) {
        return tag == null ? null : tag.getId();
    }
}
