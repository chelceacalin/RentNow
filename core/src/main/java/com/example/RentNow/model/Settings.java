package com.example.RentNow.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "settings")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Settings {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	UUID id;

	@OneToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	User user;

	boolean darkModeEnabled;

	LocalDateTime created_date;

	LocalDateTime updated_date;

}
