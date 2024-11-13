package  com.example.RentNow.specification;

import  com.example.RentNow.model.User;
import org.springframework.data.jpa.domain.Specification;

import static  com.example.RentNow.util.UserConstants.ROLE;
import static  com.example.RentNow.util.UserConstants.USERNAME;

public class UserSpecification {

	public static <T> Specification<T> hasUsernameEquals(String username) {
		return ((root, query, criteriaBuilder) -> criteriaBuilder.like(criteriaBuilder.lower(root.get(USERNAME)), username.toLowerCase()));
	}

	public static <T> Specification<T> hasRole(String role) {
		return (root, query, criteriaBuilder) -> {
			User.Role enumRole = User.Role.valueOf(role.toUpperCase());
			return criteriaBuilder.equal(
					criteriaBuilder.lower(root.get(ROLE).as(String.class)),
					enumRole.name().toLowerCase()
			);
		};
	}

}
