package com.example.TechNow.TechNow.dto.Movie;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;

import static com.example.TechNow.TechNow.util.MovieConstants.*;


@Data
@Builder
@AllArgsConstructor

public class MyRentedMoviesRequestDTO {

	private String rentUsername;

	private String title;

	private String director;

	private String category;

	private Boolean isAvailable;

	private LocalDate rentedStart;

	private LocalDate rentedUntil;
	private String direction;
	private String sortField;

	public MyRentedMoviesRequestDTO() {
		this.direction = "ASC";
		this.sortField = "title";
	}

	public Pageable getPageableRented(int pageNo, int pageSize) {
		Sort.Direction sortDirection = Sort.Direction.fromString(this.getDirection());
		return switch (sortField) {
			case TITLE -> PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, MOVIE_TITLE));
			case CATEGORY -> PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, MOVIE_CATEGORY_NAME));
			case DIRECTOR -> PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, MOVIE_DIRECTOR));
			case OWNER -> PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, MOVIE_OWNER_USERNAME));
			case RENTED_BY -> PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, RENTED_BY_USERNAME));
			case RENTED_UNTIL -> PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, RENTED_UNTIL));
			case RENTED_DATE -> PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, RENTED_DATE));
			default -> PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, this.sortField));
		};
	}

}