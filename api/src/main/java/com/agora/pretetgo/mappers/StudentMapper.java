package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.response.StudentResponseDTO;
import com.agora.pretetgo.dto.insert.StudentInsertDTO;
import com.agora.pretetgo.models.Student;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface StudentMapper {
    Student toEntity(StudentInsertDTO dto);

    StudentResponseDTO toResponseDTO(Student student);

    void updateStudentFromDto(StudentInsertDTO dto, @MappingTarget Student Student);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchStudentFromDto(StudentInsertDTO dto, @MappingTarget Student Student);

}
