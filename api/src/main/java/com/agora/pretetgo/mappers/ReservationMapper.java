package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.ReservationInsertDTO;
import com.agora.pretetgo.dto.response.ReservationResponseDTO;
import com.agora.pretetgo.models.ReservationGroup;
import com.agora.pretetgo.models.Reservation;
import com.agora.pretetgo.models.Resource;
import com.agora.pretetgo.services.ResourceService;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class ReservationMapper {
    @Autowired
    private ResourceService resourceService;

    @Mapping(target = "reservedBy", source = "reservedById")
    @Mapping(target = "resource", source = "resourceId")
    public abstract Reservation toEntity(ReservationInsertDTO dto);

    @Mapping(target = "reservedById", source = "reservedBy")
    @Mapping(target = "resourceId", source = "resource")
    public abstract ReservationResponseDTO toResponseDTO(Reservation reservation);

    @Mapping(target = "reservedBy", source = "reservedById")
    @Mapping(target = "resource", source = "resourceId")
    public abstract void updateReservationFromDto(ReservationInsertDTO dto, @MappingTarget Reservation Reservation);

    @Mapping(target = "reservedBy", source = "reservedById")
    @Mapping(target = "resource", source = "resourceId")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    public abstract void patchReservationFromDto(ReservationInsertDTO dto, @MappingTarget Reservation Reservation);

    protected ReservationGroup mapReservationGroup(Long id) {
        if (id == null) return null;
        ReservationGroup reservationGroup = new ReservationGroup();
        reservationGroup.setId(id);
        return reservationGroup;
    }

    protected Resource mapResource(Long id) {
        return id == null ? null : resourceService.getResourceById(id);
    }

    protected Long mapReservationGroupId(ReservationGroup reservationGroup) {
        return reservationGroup == null ? null : reservationGroup.getId();
    }

    protected Long mapResourceId(Resource resource) {
        return resource == null ? null : resource.getId();
    }
}