package com.example.TechNow.TechNow.dto.Movie;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
public class MovieFilterDTO {

	String owner_username;

	String title;

	String director;

	String category;

	Boolean isAvailable;

	String rentedBy;

	LocalDate rentedDate;

	LocalDate rentedUntil;

	String direction;

	String sortField;

	public MovieFilterDTO() {
		this.direction = "ASC";
		this.sortField = "title";
	}
}
