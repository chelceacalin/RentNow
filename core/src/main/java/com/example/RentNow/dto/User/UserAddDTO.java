package  com.example.RentNow.dto.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserAddDTO {

	String email;

	String firstName;

	String lastName;

	String username;

	String photoUrl;

}
