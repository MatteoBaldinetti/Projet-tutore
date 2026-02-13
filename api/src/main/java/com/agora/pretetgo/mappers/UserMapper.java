package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.response.UserResponseDTO;
import com.agora.pretetgo.models.Admin;
import com.agora.pretetgo.models.Professor;
import com.agora.pretetgo.models.Student;
import com.agora.pretetgo.models.User;
import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class UserMapper {
    @Autowired
    protected StudentMapper studentMapper;

    @Autowired
    protected ProfessorMapper professorMapper;

    @Autowired
    protected AdminMapper adminMapper;

    public UserResponseDTO toResponseDTO(User user) {
        if (user instanceof Student s) {
            return studentMapper.toResponseDTO(s);
        }
        if (user instanceof Professor p) {
            return professorMapper.toResponseDTO(p);
        }
        if (user instanceof Admin a) {
            return adminMapper.toResponseDTO(a);
        }

        throw new IllegalArgumentException("Unknown user type: " + user.getClass().getName());
    }
}