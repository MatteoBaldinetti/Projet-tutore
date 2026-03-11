package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.filter.ReservationFilterDTO;
import com.agora.pretetgo.dto.insert.ReservationInsertDTO;
import com.agora.pretetgo.dto.response.ReservationResponseDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.ReservationMapper;
import com.agora.pretetgo.models.Reservation;
import com.agora.pretetgo.models.ReservationGroup;
import com.agora.pretetgo.models.Resource;
import com.agora.pretetgo.repositories.ReservationRepository;
import com.agora.pretetgo.specifications.ReservationSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReservationMapper reservationMapper;

    @Autowired
    private ReservationGroupService reservationGroupService;

    @Autowired
    private ResourceService resourceService;

    @Transactional
    public Reservation createReservation(ReservationInsertDTO dto) {
        Reservation reservation = reservationMapper.toEntity(dto);
        mapDTOIds(dto, reservation);
        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation with ID " + id + " not found"));
    }

    @Transactional
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Transactional
    public Reservation updateReservation(Long id, ReservationInsertDTO dto) {
        Reservation current = getReservationById(id);
        reservationMapper.updateReservationFromDto(dto, current);
        mapDTOIds(dto, current);
        return reservationRepository.save(current);
    }

    @Transactional
    public void deleteReservation(Long id) {
        reservationRepository.deleteById(getReservationById(id).getId());
    }

    @Transactional
    public Reservation patchReservation(Long id, ReservationInsertDTO dto) {
        Reservation current = getReservationById(id);
        reservationMapper.patchReservationFromDto(dto, current);
        mapDTOIds(dto, current);
        return reservationRepository.save(current);
    }

    @Transactional
    public List<ReservationResponseDTO> searchReservations(ReservationFilterDTO filterDTO) {
        return reservationRepository.findAll(
                        ReservationSpecification.withFilter(filterDTO)
                )
                .stream()
                .map(reservationMapper::toResponseDTO)
                .toList();
    }

    private void mapDTOIds(ReservationInsertDTO dto, Reservation current) {
        setReservedBy(dto, current);
        setResource(dto, current);
    }

    private void setReservedBy(ReservationInsertDTO dto, Reservation current) {
        if (dto.reservedById() != null) {
            ReservationGroup reservationGroup = reservationGroupService.getReservationGroupById(dto.reservedById());
            current.setReservedBy(reservationGroup);
        }
    }

    private void setResource(ReservationInsertDTO dto, Reservation current) {
        if (dto.resourceId() != null) {
            Resource resource = resourceService.getResourceById(dto.resourceId());
            current.setResource(resource);
        }
    }
}