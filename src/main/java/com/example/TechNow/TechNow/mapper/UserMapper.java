package com.example.TechNow.TechNow.mapper;


import com.example.TechNow.TechNow.dto.User.UserDTO;
import com.example.TechNow.TechNow.model.User;

public class UserMapper {

    public static UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .role(user.getRole())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .build();
    }

    public static User toUser(UserDTO user) {
        return User.builder()
                .id(user.getId())
                .role(user.getRole())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .build();
    }
}
