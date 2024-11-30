package  com.example.RentNow.dto.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserAddReponseDTO {

	String id;

	String email;

	String firstName;

	String lastName;

	String username;

	String photoUrl;

	String role;

	Boolean is_active;

	boolean mailNotificationsEnabled;

	boolean subscribedToNewsletter;

	boolean darkModeEnabled;
}
