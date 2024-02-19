package com.example.TechNow.TechNow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Table(uniqueConstraints = @UniqueConstraint(
		columnNames = {"id", "user_id", "movie_id"}
))
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

	private LocalDate rentedUntil;

	private Integer rating;

	private String description;

	@OneToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	private User rentedBy;

	@ManyToOne
	@JoinColumn(name = "movie_id", referencedColumnName = "id")
	private Movie movie;
}
