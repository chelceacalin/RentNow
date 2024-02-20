package com.example.TechNow.TechNow.service;


import com.example.TechNow.TechNow.dto.Movie.MovieDTO;
import com.example.TechNow.TechNow.dto.Movie.MovieFilterDTO;
import com.example.TechNow.TechNow.mapper.MovieMapper;
import com.example.TechNow.TechNow.model.Movie;
import com.example.TechNow.TechNow.model.MovieHistory;
import com.example.TechNow.TechNow.repository.CategoryRepository;
import com.example.TechNow.TechNow.repository.MovieHistoryRepository;
import com.example.TechNow.TechNow.repository.MovieRepository;
import com.example.TechNow.TechNow.specification.MovieSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static com.example.TechNow.TechNow.specification.GenericSpecification.fieldNameLike;
import static com.example.TechNow.TechNow.specification.GenericSpecification.isAvailable;
import static com.example.TechNow.TechNow.specification.MovieSpecification.hasCategory;
import static com.example.TechNow.TechNow.specification.MovieSpecification.hasUsername;
import static com.example.TechNow.TechNow.util.MovieConstants.*;
import static java.util.Objects.nonNull;

@Service
@Transactional
@RequiredArgsConstructor
public class MovieService {

	final MovieRepository movieRepository;
	final MovieHistoryRepository movieHistoryRepository;
	final UserService userService;
	final CategoryRepository categoryRepository;


	public Page<MovieDTO> findUserMovies(MovieFilterDTO movieFilter, int pageNo, int pageSize) {
		Specification<Movie> specification = getSpecification(movieFilter);
		Sort.Direction sortDirection = Sort.Direction.fromString(movieFilter.getDirection());
		Pageable pageable = getPageable(pageNo, pageSize, movieFilter.getSortField(), sortDirection);

		Page<Movie> moviesPage = movieRepository.findAll(specification, pageable);
		List<MovieDTO> movies = moviesPage.getContent().stream()
				.map(movie -> {
					MovieHistory history = movieHistoryRepository.findMovieHistoryByRentedUntilMostRecent(movie.getId());
					return MovieMapper.toDto(movie, history);
				})
				.collect(Collectors.toList());

		return new PageImpl<>(movies, pageable, moviesPage.getTotalElements());
	}

	private static Pageable getPageable(int pageNo, int pageSize, String sortField, Sort.Direction sortDirection) {
		return switch (sortField) {
			case RENTED_BY -> PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, USERNAME));
			case RENTED_UNTIL -> PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, MOVIE_HISTORIES_RENTED_UNTIL));
			case RENTED_DATE -> PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, MOVIE_HISTORIES_RENTED_DATE));
			default -> PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, sortField));
		};
	}

	private Specification<Movie> getSpecification(MovieFilterDTO movieFilter) {
		Specification<Movie> specification = Specification.where(null);

		if (nonNull(movieFilter.getOwner_username())) {
			specification = specification.and(hasUsername(movieFilter.getOwner_username()));
		}

		if (nonNull(movieFilter.getTitle())) {
			specification = specification.and(fieldNameLike(movieFilter.getTitle(), TITLE));
		}

		if (nonNull(movieFilter.getDirector())) {
			specification = specification.and(fieldNameLike(movieFilter.getDirector(), DIRECTOR));
		}

		if (nonNull(movieFilter.getCategory())) {
			specification = specification.and(hasCategory(movieFilter.getCategory()));
		}

		if (nonNull(movieFilter.getIsAvailable())) {
			specification = specification.and(isAvailable(movieFilter.getIsAvailable()));
		}

		if (nonNull(movieFilter.getRentedBy())) {
			specification = specification.and(MovieSpecification.getRentedBy(movieFilter.getRentedBy()));
		}

		if (nonNull(movieFilter.getRentedDate())) {
			specification = specification.and(MovieSpecification.rentedDateFieldEquals(movieFilter.getRentedDate(), RENTED_DATE));
		}

		if (nonNull(movieFilter.getRentedUntil())) {
			specification = specification.and(MovieSpecification.rentedDateFieldEquals(movieFilter.getRentedUntil(), RENTED_UNTIL));
		}
		return specification;
	}
}
