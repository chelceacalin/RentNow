package  com.example.RentNow.dto.User;

import  com.example.RentNow.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserFilterDTO {
	String username;

	String firstName;

	String lastName;

	String email;

	String direction;

	String sortField;

	User.Role role;

	Boolean is_active;

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
