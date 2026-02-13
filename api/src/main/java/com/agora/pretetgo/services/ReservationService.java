package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.filter.ReservationFilterDTO;
import com.agora.pretetgo.dto.insert.ReservationInsertDTO;
import com.agora.pretetgo.dto.response.ReservationResponseDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.ReservationMapper;
import com.agora.pretetgo.models.Reservation;
import com.agora.pretetgo.models.ReservationGroup;
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

    @Transactional
    public Reservation createReservation(ReservationInsertDTO dto) {
        Reservation reservation = reservationMapper.toEntity(dto);
        setReservedBy(dto, reservation);
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
        setReservedBy(dto, current);
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
        setReservedBy(dto, current);
        return reservationRepository.save(current);
    }

    private void setReservedBy(ReservationInsertDTO dto, Reservation current) {
        if (dto.reservedById() != null) {
            ReservationGroup reservationGroup = reservationGroupService.getReservationGroupById(dto.reservedById());
            current.setReservedBy(reservationGroup);
        }
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
}