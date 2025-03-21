package  com.example.RentNow.dto.User;


import  com.example.RentNow.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
	String id;

	String username;

	String firstName;

	String lastName;

	String email;

	User.Role role;

	Boolean is_active;

	String photoUrl;

	boolean mailNotificationsEnabled;

	boolean subscribedToNewsletter;

	boolean darkModeEnabled;
}
