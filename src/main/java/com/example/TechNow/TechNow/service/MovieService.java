package com.example.TechNow.TechNow.service;


import com.example.TechNow.TechNow.dto.Movie.*;
import com.example.TechNow.TechNow.dto.MovieHistory.MovieHistoryDTO;
import com.example.TechNow.TechNow.dto.User.UserDTO;
import com.example.TechNow.TechNow.mapper.MovieMapper;
import com.example.TechNow.TechNow.model.Category;
import com.example.TechNow.TechNow.model.Movie;
import com.example.TechNow.TechNow.model.MovieHistory;
import com.example.TechNow.TechNow.model.User;
import com.example.TechNow.TechNow.repository.CategoryRepository;
import com.example.TechNow.TechNow.repository.MovieHistoryRepository;
import com.example.TechNow.TechNow.repository.MovieRepository;
import com.example.TechNow.TechNow.repository.UserRepository;
import com.example.TechNow.TechNow.specification.MovieSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.example.TechNow.TechNow.mapper.MovieHistoryMapper.toMovieHistory;
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
	final UserRepository userRepository;

	public Page<MovieDTO> findUserMovies(MovieFilterDTO movieFilter, int pageNo, int pageSize) {
		Specification<Movie> specification = getSpecification(movieFilter);
		Sort.Direction sortDirection = Sort.Direction.fromString(movieFilter.getDirection());
		Pageable pageable = getPageable(pageNo, pageSize, movieFilter.getSortField(), sortDirection);

		Page<Movie> moviesPage = movieRepository.findAll(specification, pageable);
		List<MovieDTO> movies = moviesPage.getContent().stream()
				.map(movie -> {
					MovieHistory history = movieHistoryRepository.findMovieHistoryByRentedUntilMostRecent(movie.getId());
					System.out.println(movie.getOwner());
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

	public Optional<Movie> findById(UUID id) {
		return movieRepository.findById(id);
	}

	public MovieAddDTO findMovieByID(UUID id) {
		Optional<Movie> movieOptional = movieRepository.findById(id);
		if (movieOptional.isPresent()) {
			Movie movie = movieOptional.get();
			return MovieMapper.toMovieAddDto(movie);
		} else {
			throw new RuntimeException("Movie with id " + id + " not found");
		}
	}

	public void updateMovie(UUID id, MovieAddDTO movieDTO) {
		Optional<Movie> optionalMovie = movieRepository.findById(id);
		if (optionalMovie.isPresent()) {
			Movie foundMovie = optionalMovie.get();
			Optional<Category> categoryOptional = categoryRepository.findByNameIgnoreCase(movieDTO.getCategory());
			if (categoryOptional.isPresent()) {
				foundMovie.setCategory(categoryOptional.get());
				foundMovie.setTitle(movieDTO.getTitle());
				foundMovie.setDirector(movieDTO.getDirector());
				foundMovie.setDescription(movieDTO.getDescription());
				movieRepository.save(foundMovie);
			} else {
				throw new RuntimeException("Category not found");
			}

		} else {
			throw new RuntimeException("Movie Not Found");
		}
	}

	public void deleteMovieIfNotRented(UUID id) {
		Movie movieFound = movieRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Movie to be deleted does not exist"));
		if (!movieFound.isAvailable()) {
			String userName = getRentedBy(id);
			throw new RuntimeException("Movie is being watched by: " + userName
					+ ". You will be able to delete it after it's been returned");
		}
		movieHistoryRepository.deleteMovieHistoryByMovie_Id(id);
		movieRepository.deleteById(id);
	}

	public String getRentedBy(UUID id) {
		MovieHistory movieHistory = movieHistoryRepository.findMovieHistoryByRentedUntilMostRecent(id);
		User user = movieHistory.getRentedBy();
		String firstName = user.getFirstName();
		String lastName = user.getLastName();
		return movieHistory.getRentedBy().getEmail();
	}

	public MovieRentDTO findMovieToRent(UUID id) {
		return movieRepository.findById(id)
				.map(MovieMapper::toMovieRentDto)
				.orElseThrow(() -> new RuntimeException("Movie not found"));
	}

	public MovieAddDTO addMovie(MovieAddDTO movie) {
		UserDTO user = userService.findByEmail(movie.getOwner_email());
		if (nonNull(user)) {
			Optional<Category> categoryOptional = categoryRepository.findByNameIgnoreCase(movie.getCategory());
			if (categoryOptional.isPresent()) {
				Category category = categoryOptional.get();
				Movie createdMovie = MovieMapper.toMovie(movie, user, category);
				movieRepository.save(createdMovie);
				return MovieMapper.toMovieAddDto(createdMovie);
			} else {
				throw new RuntimeException("Category not found");
			}
		} else {
			throw new RuntimeException("User not found");
		}
	}

	public void addMovieHistory(MovieHistoryDTO movieHistoryDTO) {
		Optional<Movie> movieOptional = movieRepository.findById(movieHistoryDTO.getMovieId());
		movieOptional.ifPresent(movie -> {
			movie.setAvailable(false);
			movieRepository.save(movie);
		});
		MovieHistory movieHistory = toMovieHistory(movieHistoryDTO);
		movieHistoryRepository.save(movieHistory);
	}

	public Optional<String> validateMovieHistory(MovieHistoryDTO movieHistoryDTO) {
		System.out.println("Movie history "+movieHistoryDTO);
		Optional<Movie> movie = movieRepository.findById(movieHistoryDTO.getMovieId());
		if (movie.isEmpty()) {
			return Optional.of("Movie not found");
		}
		if (!movie.get().isAvailable()) {
			return Optional.of("Movie is not available, was rented by another user");
		}


		Optional<User> user = userRepository.findById(String.valueOf(movieHistoryDTO.getUserId()));
		if (user.isEmpty()) {
			return Optional.of("User not found");
		}
		return Optional.empty();
	}

	public Page<MovieDTO> findRentedMoviesForUser(MyRentedMoviesRequestDTO myRentedMoviesDTO, int pageNo, int pageSize) {
		UserDTO user = userService.findByEmail(myRentedMoviesDTO.getRentEmail());
		Pageable pageable = myRentedMoviesDTO.getPageableRented(pageNo, pageSize);

		Page<MovieHistory> movieHistories = movieHistoryRepository.findAllByRentedBy_Id(user.getId(), pageable);
		List<MovieDTO> rentedMovies = movieHistories.getContent().stream()
				.map(history -> MovieMapper.toDto(history.getMovie(), history))
				.collect(Collectors.toList());
		return new PageImpl<>(rentedMovies, pageable, movieHistories.getTotalElements());
	}

	public void changeRentedMovieStatus(UUID id) {
		Optional<Movie> movieOptional = movieRepository.findById(id);
		if (movieOptional.isPresent()) {
			Movie movie = movieOptional.get();
			movie.setAvailable(true);
			movieRepository.save(movie);
		} else {
			throw new RuntimeException("Movie is not found");
		}
	}
}
