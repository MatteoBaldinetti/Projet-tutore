package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.FileMetaDataDTO;
import com.agora.pretetgo.dto.response.FileMetaDataResponseDTO;
import com.agora.pretetgo.models.FileMetaData;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface FileMetaDataMapper {
    FileMetaData toEntity(FileMetaDataDTO dto);

    FileMetaDataResponseDTO toResponseDTO(FileMetaData fileMetaData);

    void updateFileMetaDataFromDto(FileMetaDataDTO dto, @MappingTarget FileMetaData fileMetaData);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchFileMetaDataFromDto(FileMetaDataDTO dto, @MappingTarget FileMetaData fileMetaData);

}
