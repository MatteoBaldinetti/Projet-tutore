package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.response.FileMetaDataResponseDTO;
import com.agora.pretetgo.dto.insert.FileMetaDataInsertDTO;
import com.agora.pretetgo.models.FileMetaData;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface FileMetaDataMapper {
    FileMetaData toEntity(FileMetaDataInsertDTO dto);

    FileMetaDataResponseDTO toResponseDTO(FileMetaData fileMetaData);

    void updateFileMetaDataFromDto(FileMetaDataInsertDTO dto, @MappingTarget FileMetaData fileMetaData);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchFileMetaDataFromDto(FileMetaDataInsertDTO dto, @MappingTarget FileMetaData fileMetaData);

}
