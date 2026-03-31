package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.SecurityAgentInsertDTO;
import com.agora.pretetgo.dto.response.SecurityAgentResponseDTO;
import com.agora.pretetgo.models.SecurityAgent;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SecurityAgentMapper {
    SecurityAgent toEntity(SecurityAgentInsertDTO dto);

    SecurityAgentResponseDTO toResponseDTO(SecurityAgent agent);

    void updateSecurityAgentFromDto(SecurityAgentInsertDTO dto, @MappingTarget SecurityAgent agent);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchSecurityAgentFromDto(SecurityAgentInsertDTO dto, @MappingTarget SecurityAgent agent);
}
