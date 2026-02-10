package com.agora.pretetgo.mappers;

import com.agora.pretetgo.dto.response.UserResponseDTO;
import com.agora.pretetgo.models.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponseDTO toResponseDTO(User user);
}