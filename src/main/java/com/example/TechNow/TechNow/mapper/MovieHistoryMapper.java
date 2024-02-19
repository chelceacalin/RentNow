package com.example.TechNow.TechNow.mapper;

import com.example.TechNow.TechNow.dto.MovieHistory.MovieHistoryDTO;
import com.example.TechNow.TechNow.model.Movie;
import com.example.TechNow.TechNow.model.MovieHistory;
import com.example.TechNow.TechNow.model.User;

import java.util.UUID;

public class MovieHistoryMapper {
	public static MovieHistory toMovieHistory(MovieHistoryDTO movieHistoryDTO) {
		Movie movie = new Movie();
		movie.setId(movieHistoryDTO.getMovieId());

		User user = new User();
		user.setId(String.valueOf(movieHistoryDTO.getUserId()));

		return MovieHistory.builder()
				.id(UUID.randomUUID())
				.description(movieHistoryDTO.getDescription())
				.rating(movieHistoryDTO.getRating())
				.rentedDate(movieHistoryDTO.getRentedDate())
				.rentedUntil(movieHistoryDTO.getRentedUntil())
				.movie(movie)
				.rentedBy(user)
				.build();
	}
}
