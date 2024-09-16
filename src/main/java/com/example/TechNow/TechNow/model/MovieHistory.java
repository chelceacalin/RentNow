package com.example.TechNow.TechNow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Table
@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MovieHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	UUID id;

	LocalDate rentedDate;

	LocalDate rentedUntil;

	Integer rating;

	String description;

	@OneToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	User rentedBy;

	@ManyToOne
	@JoinColumn(name = "movie_id", referencedColumnName = "id")
	Movie movie;

	LocalDateTime created_date;

	LocalDateTime updated_date;
}
