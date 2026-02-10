package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.AdminDTO;
import com.agora.pretetgo.dto.response.AdminResponseDTO;
import com.agora.pretetgo.models.Admin;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AdminMapper {
    Admin toEntity(AdminDTO dto);

    AdminResponseDTO toResponseDTO(Admin admin);

    void updateAdminFromDto(AdminDTO dto, @MappingTarget Admin admin);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchAdminFromDto(AdminDTO dto, @MappingTarget Admin admin);

}
