package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.ReservationGroupDTO;
import com.agora.pretetgo.dto.response.ReservationGroupResponseDTO;
import com.agora.pretetgo.models.ReservationGroup;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ReservationGroupMapper {
    ReservationGroup toEntity(ReservationGroupDTO dto);

    ReservationGroupResponseDTO toResponseDTO(ReservationGroup reservationGroup);

    void updateReservationGroupFromDto(ReservationGroupDTO dto, @MappingTarget ReservationGroup ReservationGroup);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchReservationGroupFromDto(ReservationGroupDTO dto, @MappingTarget ReservationGroup ReservationGroup);

}
