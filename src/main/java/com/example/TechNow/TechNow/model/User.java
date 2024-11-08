package com.example.TechNow.TechNow.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
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

	String photoUrl;

	Boolean is_active;

	LocalDateTime created_date;

	LocalDateTime updated_date;

	boolean mailNotificationsEnabled;

	boolean subscribedToNewsletter;

	@Column
	@Enumerated(value = EnumType.STRING)
	Role role;

	public enum Role {
		ADMIN, USER, ALL
	}
}
