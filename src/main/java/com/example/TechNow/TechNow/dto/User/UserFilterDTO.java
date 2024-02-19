package com.example.TechNow.TechNow.dto.User;

import com.example.TechNow.TechNow.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserFilterDTO {
	private String username;
	private String firstName;
	private String lastName;
	private String email;
	private String direction;
	private String sortField;
	private User.Role role;

	public UserFilterDTO() {
		direction = "ASC";
		sortField = "defaultsort";
	}

	@Override
	public String toString() {
		String queryString = "?";
		if (username != null) {
			queryString = queryString + "username" + "=" + username + "&";
		}
		if (firstName != null) {
			queryString = queryString + "firstName" + "=" + firstName + "&";
		}
		if (lastName != null) {
			queryString = queryString + "lastName" + "=" + lastName + "&";
		}
		if (email != null) {
			queryString = queryString + "email" + "=" + email + "&";
		}
		if (direction != null) {
			queryString = queryString + "direction" + "=" + direction + "&";
		}
		if (sortField != null) {
			queryString = queryString + "sortField" + "=" + sortField + "&";
		}
		if (role != null) {
			queryString = queryString + "role" + "=" + role + "&";
		}
		return queryString;
	}
}
