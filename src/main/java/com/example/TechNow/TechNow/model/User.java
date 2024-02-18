package com.example.TechNow.TechNow.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

	@Id
	String id;

	@Column(unique = true)
	String email;

	String firstName;

	String lastName;

	String username;

	Role role;

	LocalDateTime createdDate;

	LocalDateTime updatedDate;

	public enum Role {
		ADMIN, USER
	}
}
