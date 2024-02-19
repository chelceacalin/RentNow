package com.example.TechNow.TechNow.dto.User;


import com.example.TechNow.TechNow.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
	private String id;
	private String username;
	private String firstName;
	private String lastName;
	private String email;
	private User.Role role;
}
