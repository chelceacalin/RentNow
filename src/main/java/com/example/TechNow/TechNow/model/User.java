package com.example.TechNow.TechNow.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

	@Id
	String id;

	@Column(unique = true)
	String email;

	String firstName;

	String lastName;

	String username;

	@Column
	@Enumerated(value = EnumType.STRING)
	private Role role;

	public enum Role {
		ADMIN, USER
	}
}
