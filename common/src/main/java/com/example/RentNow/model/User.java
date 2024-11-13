package com.example.RentNow.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
	String id;
	String email;
	String firstName;
	String lastName;
	String username;
	String photoUrl;
	Boolean is_active;
	LocalDateTime created_date;
	LocalDateTime updated_date;
	boolean mailNotificationsEnabled;
	Role role;

	public enum Role {
		ADMIN, USER, ALL
	}
}
