package com.example.TechNow.TechNow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "movie")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Movie {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	UUID id;

	String title;

	String director;

	String description;

	@Column(name = "is_available")
	boolean isAvailable;

	@ManyToOne
	@JoinColumn(name = "category_id", referencedColumnName = "id")
	Category category;

	@ManyToOne
	@JoinColumn(name = "owner_id", referencedColumnName = "id")
	User owner;

	@OneToMany(mappedBy = "movie")
	List<MovieHistory> movieHistories;

}
