package  com.example.RentNow.mapper;


import  com.example.RentNow.dto.User.UserAddDTO;
import  com.example.RentNow.dto.User.UserAddReponseDTO;
import  com.example.RentNow.dto.User.UserDTO;
import  com.example.RentNow.model.NewsLetterSubscription;
import  com.example.RentNow.model.User;

public class UserMapper {

	public static UserDTO toDTO(User user, NewsLetterSubscription newsLetterSubscription) {
		return UserDTO.builder()
				.id(user.getId())
				.role(user.getRole())
				.username(user.getUsername())
				.firstName(user.getFirstName())
				.lastName(user.getLastName())
				.email(user.getEmail())
				.is_active(user.getIs_active())
				.photoUrl(user.getPhotoUrl())
				.mailNotificationsEnabled(user.isMailNotificationsEnabled())
				.subscribedToNewsletter(newsLetterSubscription != null && newsLetterSubscription.isSubscribed())
				.build();
	}

	public static User toUser(UserDTO user) {
		return User.builder()
				.id(user.getId())
				.role(user.getRole())
				.username(user.getUsername())
				.firstName(user.getFirstName())
				.lastName(user.getLastName())
				.email(user.getEmail())
				.is_active(user.getIs_active())
				.photoUrl(user.getPhotoUrl())
				.build();
	}


	public static User toUserFromUserAddDTO(UserAddDTO userAddDTO) {
		return User.builder()
				.email(userAddDTO.getEmail())
				.username(userAddDTO.getUsername())
				.firstName(userAddDTO.getFirstName())
				.lastName(userAddDTO.getLastName())
				.role(User.Role.USER)
				.photoUrl(userAddDTO.getPhotoUrl())
				.build();
	}

	public static UserAddReponseDTO toUserAddReponseDTOFromUser(User user, NewsLetterSubscription newsLetterSubscription) {
		return UserAddReponseDTO.builder()
				.id(user.getId())
				.email(user.getEmail())
				.username(user.getUsername())
				.firstName(user.getFirstName())
				.lastName(user.getLastName())
				.role(user.getRole() != null ? user.getRole().toString() : User.Role.USER.toString())
				.photoUrl(user.getPhotoUrl())
				.is_active(user.getIs_active())
				.mailNotificationsEnabled(user.isMailNotificationsEnabled())
				.subscribedToNewsletter(newsLetterSubscription != null && newsLetterSubscription.isSubscribed())
				.build();
	}
}
