package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.ReservationGroupInsertDTO;
import com.agora.pretetgo.dto.response.ReservationGroupResponseDTO;
import com.agora.pretetgo.models.ReservationGroup;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ReservationGroupMapper {
    ReservationGroup toEntity(ReservationGroupInsertDTO dto);

    ReservationGroupResponseDTO toResponseDTO(ReservationGroup reservationGroup);

    void updateReservationGroupFromDto(ReservationGroupInsertDTO dto, @MappingTarget ReservationGroup ReservationGroup);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchReservationGroupFromDto(ReservationGroupInsertDTO dto, @MappingTarget ReservationGroup ReservationGroup);

}
