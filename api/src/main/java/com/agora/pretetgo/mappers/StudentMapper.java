package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.insert.StudentDTO;
import com.agora.pretetgo.dto.response.StudentResponseDTO;
import com.agora.pretetgo.models.Student;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface StudentMapper {
    Student toEntity(StudentDTO dto);

    StudentResponseDTO toResponseDTO(Student student);

    void updateStudentFromDto(StudentDTO dto, @MappingTarget Student Student);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void patchStudentFromDto(StudentDTO dto, @MappingTarget Student Student);

}
