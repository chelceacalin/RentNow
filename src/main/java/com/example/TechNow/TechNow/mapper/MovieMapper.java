package com.example.TechNow.TechNow.mapper;

import com.example.TechNow.TechNow.dto.Movie.MovieAddDTO;
import com.example.TechNow.TechNow.dto.Movie.MovieDTO;
import com.example.TechNow.TechNow.dto.Movie.MovieRentDTO;
import com.example.TechNow.TechNow.dto.User.UserDTO;
import com.example.TechNow.TechNow.model.Category;
import com.example.TechNow.TechNow.model.Movie;
import com.example.TechNow.TechNow.model.MovieHistory;

public class MovieMapper {
	public static MovieDTO toDto(Movie m, MovieHistory mh) {
		return MovieDTO.builder()
				.id(m.getId())
				.title(m.getTitle())
				.director(m.getDirector())
				.category(m.getCategory() != null ? m.getCategory().getName() : "DEFAULT")
				.description(m.getDescription())
				.isAvailable(m.isAvailable())
				.rentedBy(mh != null && mh.getRentedBy() != null ? mh.getRentedBy().getUsername() : "available")
				.owner_username(m.getOwner().getUsername())
				.owner_email(m.getOwner().getEmail())
				.rentedDate(mh != null && mh.getRentedDate() != null ? mh.getRentedDate() : null)
				.rentedUntil(mh != null && mh.getRentedUntil() != null ? mh.getRentedUntil() : null)
				.photoUrl(m.getPhotoUrl() != null ? m.getPhotoUrl() : "")
				.build();
	}

	public static Movie toMovie(MovieAddDTO dto, UserDTO userDTO, Category category) {
		return Movie.builder()
				.title(dto.getTitle())
				.description(dto.getDescription())
				.isAvailable(dto.getIsAvailable())
				.director(dto.getDirector())
				.category(category)
				.owner(UserMapper.toUser(userDTO))
				.build();
	}

	public static MovieAddDTO toMovieAddDto(Movie movie) {
		return MovieAddDTO.builder()
				.title(movie.getTitle())
				.director(movie.getDirector())
				.description(movie.getDescription())
				.category(movie.getCategory().getName())
				.owner_username(movie.getOwner().getUsername())
				.owner_email(movie.getOwner().getEmail())
				.isAvailable(movie.isAvailable())
				.id(movie.getId())
				.photoUrl(movie.getPhotoUrl() != null ? movie.getPhotoUrl() : "")
				.build();
	}

	public static MovieRentDTO toMovieRentDto(Movie movie) {
		return MovieRentDTO.builder()
				.title(movie.getTitle())
				.director(movie.getDirector())
				.ownerUsername(movie.getOwner().getUsername())
				.ownerEmail(movie.getOwner().getEmail())
				.build();
	}
}
