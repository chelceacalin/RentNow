package com.example.TechNow.TechNow.dto.User;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserPreferencesDTO {

	boolean mailNotificationsEnabled;

	boolean subscribedToNewsletter;
}
