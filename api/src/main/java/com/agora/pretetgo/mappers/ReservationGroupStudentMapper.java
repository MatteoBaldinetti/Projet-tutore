package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.ReservationGroupStudentDTO;
import com.agora.pretetgo.dto.response.ReservationGroupStudentResponseDTO;
import com.agora.pretetgo.models.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ReservationGroupStudentMapper {
    @Mapping(target = "reservationGroup", source = "reservationGroupId")
    @Mapping(target = "student", source = "studentId")
    ReservationGroupStudent toEntity(ReservationGroupStudentDTO dto);

    @Mapping(target = "reservationGroupId", source = "reservationGroup")
    @Mapping(target = "studentId", source = "student")
    ReservationGroupStudentResponseDTO toResponseDTO(ReservationGroupStudent reservationGroup);

    @Mapping(target = "reservationGroup", source = "reservationGroupId")
    @Mapping(target = "student", source = "studentId")
    void updateReservationGroupStudentFromDto(ReservationGroupStudentDTO dto, @MappingTarget ReservationGroupStudent ReservationGroupStudent);

    @Mapping(target = "reservationGroup", source = "reservationGroupId")
    @Mapping(target = "student", source = "studentId")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchReservationGroupStudentFromDto(ReservationGroupStudentDTO dto, @MappingTarget ReservationGroupStudent ReservationGroupStudent);
    
    default ReservationGroup mapReservationGroup(Long id) {
        if (id == null) return null;
        ReservationGroup ReservationGroup = new ReservationGroup();
        ReservationGroup.setId(id);
        return ReservationGroup;
    }

    default Student mapStudent(Long id) {
        if (id == null) return null;
        Student Student = new Student();
        Student.setId(id);
        return Student;
    }

    default Long mapReservationGroupId(ReservationGroup reservationGroup) {
        return reservationGroup == null ? null : reservationGroup.getId();
    }

    default Long mapStudentId(Student student) {
        return student == null ? null : student.getId();
    }
}