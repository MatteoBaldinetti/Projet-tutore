package com.agora.pretetgo.services;

import com.agora.pretetgo.dto.filter.ReservationGroupStudentFilterDTO;
import com.agora.pretetgo.dto.insert.ReservationGroupStudentInsertDTO;
import com.agora.pretetgo.dto.response.ReservationGroupStudentResponseDTO;
import com.agora.pretetgo.exceptions.ResourceNotFoundException;
import com.agora.pretetgo.mappers.ReservationGroupStudentMapper;
import com.agora.pretetgo.models.ReservationGroup;
import com.agora.pretetgo.models.ReservationGroupStudent;
import com.agora.pretetgo.models.Student;
import com.agora.pretetgo.repositories.ReservationGroupStudentRepository;
import com.agora.pretetgo.specifications.ReservationGroupStudentSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationGroupStudentService {
    @Autowired
    private ReservationGroupStudentRepository reservationGroupStudentRepository;

    @Autowired
    private ReservationGroupStudentMapper reservationGroupStudentMapper;

    @Autowired
    private ReservationGroupService reservationGroupService;

    @Autowired
    private StudentService studentService;

    @Transactional
    public ReservationGroupStudent createReservationGroupStudent(ReservationGroupStudentInsertDTO dto) {
        ReservationGroupStudent reservationGroupStudent = reservationGroupStudentMapper.toEntity(dto);
        setReservationGroup(dto, reservationGroupStudent);
        setStudent(dto, reservationGroupStudent);
        return reservationGroupStudentRepository.save(reservationGroupStudent);
    }

    @Transactional
    public ReservationGroupStudent getReservationGroupStudentById(Long id) {
        return reservationGroupStudentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ReservationGroupStudent with ID " + id + " not found"));
    }

    @Transactional
    public List<ReservationGroupStudent> getAllReservationGroupStudents() {
        return reservationGroupStudentRepository.findAll();
    }

    @Transactional
    public ReservationGroupStudent updateReservationGroupStudent(Long id, ReservationGroupStudentInsertDTO dto) {
        ReservationGroupStudent current = getReservationGroupStudentById(id);
        reservationGroupStudentMapper.updateReservationGroupStudentFromDto(dto, current);
        setReservationGroup(dto, current);
        setStudent(dto, current);
        return reservationGroupStudentRepository.save(current);
    }

    @Transactional
    public void deleteReservationGroupStudent(Long id) {
        reservationGroupStudentRepository.deleteById(getReservationGroupStudentById(id).getId());
    }

    @Transactional
    public ReservationGroupStudent patchReservationGroupStudent(Long id, ReservationGroupStudentInsertDTO dto) {
        ReservationGroupStudent current = getReservationGroupStudentById(id);
        reservationGroupStudentMapper.patchReservationGroupStudentFromDto(dto, current);
        setReservationGroup(dto, current);
        setStudent(dto, current);
        return reservationGroupStudentRepository.save(current);
    }

    private void setReservationGroup(ReservationGroupStudentInsertDTO dto, ReservationGroupStudent current) {
        if (dto.reservationGroupId() != null) {
            ReservationGroup reservationGroup = reservationGroupService.getReservationGroupById(dto.reservationGroupId());
            current.setReservationGroup(reservationGroup);
        }
    }

    private void setStudent(ReservationGroupStudentInsertDTO dto, ReservationGroupStudent current) {
        if (dto.studentId() != null) {
            Student student = studentService.getStudentById(dto.studentId());
            current.setStudent(student);
        }
    }

    @Transactional
    public List<ReservationGroupStudentResponseDTO> searchReservationGroupStudents(ReservationGroupStudentFilterDTO filterDTO) {
        return reservationGroupStudentRepository.findAll(
                        ReservationGroupStudentSpecification.withFilter(filterDTO)
                )
                .stream()
                .map(reservationGroupStudentMapper::toResponseDTO)
                .toList();
    }
}