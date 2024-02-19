package com.example.TechNow.TechNow.dto.Movie;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
public class MovieFilterDTO {

	private String owner_username;

	private String title;

	private String director;

	private String category;

	private Boolean isAvailable;

	private String rentedBy;

	private LocalDate rentedDate;

	private LocalDate rentedUntil;

	private String direction;
	private String sortField;

	public MovieFilterDTO() {
		this.direction = "ASC";
		this.sortField = "title";
	}
}
