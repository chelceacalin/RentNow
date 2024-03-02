package com.example.TechNow.TechNow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
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
	private UUID id;

	private LocalDate rentedDate;

	LocalDate rentedUntil;

	Integer rating;

	String description;

	@OneToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	User rentedBy;

	@ManyToOne
	@JoinColumn(name = "movie_id", referencedColumnName = "id")
	Movie movie;
}
