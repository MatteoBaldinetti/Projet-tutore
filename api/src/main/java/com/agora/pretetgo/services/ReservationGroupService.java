package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.insert.ReservationGroupDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.ReservationGroupMapper;
import com.agora.pretetgo.models.ReservationGroup;
import com.agora.pretetgo.repositories.ReservationGroupRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationGroupService {
    @Autowired
    private ReservationGroupRepository reservationGroupRepository;

    @Autowired
    private ReservationGroupMapper reservationGroupMapper;

    @Transactional
    public ReservationGroup createReservationGroup(ReservationGroupDTO dto) {
        ReservationGroup reservationGroup = reservationGroupMapper.toEntity(dto);
        return reservationGroupRepository.save(reservationGroup);
    }

    @Transactional
    public ReservationGroup getReservationGroupById(Long id) {
        return reservationGroupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ReservationGroup with ID " + id + " not found"));
    }

    @Transactional
    public List<ReservationGroup> getAllReservationGroups() {
        return reservationGroupRepository.findAll();
    }

    @Transactional
    public ReservationGroup updateReservationGroup(Long id, ReservationGroupDTO dto) {
        ReservationGroup current = getReservationGroupById(id);
        reservationGroupMapper.updateReservationGroupFromDto(dto, current);
        return reservationGroupRepository.save(current);
    }

    @Transactional
    public void deleteReservationGroup(Long id) {
        reservationGroupRepository.deleteById(getReservationGroupById(id).getId());
    }

    @Transactional
    public ReservationGroup patchReservationGroup(Long id, ReservationGroupDTO dto) {
        ReservationGroup current = getReservationGroupById(id);
        reservationGroupMapper.patchReservationGroupFromDto(dto, current);
        return reservationGroupRepository.save(current);
    }
}