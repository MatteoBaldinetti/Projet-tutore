package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.AdminInsertDTO;
import com.agora.pretetgo.dto.response.AdminResponseDTO;
import com.agora.pretetgo.models.Admin;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AdminMapper {
    Admin toEntity(AdminInsertDTO dto);

    AdminResponseDTO toResponseDTO(Admin admin);

    void updateAdminFromDto(AdminInsertDTO dto, @MappingTarget Admin admin);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchAdminFromDto(AdminInsertDTO dto, @MappingTarget Admin admin);

}
