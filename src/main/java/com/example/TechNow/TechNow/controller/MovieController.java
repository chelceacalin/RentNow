package com.example.TechNow.TechNow.controller;

import com.example.TechNow.TechNow.dto.Movie.*;
import com.example.TechNow.TechNow.dto.MovieHistory.MovieHistoryDTO;
import com.example.TechNow.TechNow.service.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
public class MovieController {

	final MovieService movieService;

	@GetMapping
	public Page<MovieDTO> findUserMovies(@ModelAttribute MovieFilterDTO dto,
										 @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
										 @RequestParam(name = "pageSize", defaultValue = "15") int pageSize) {
		return movieService.findUserMovies(dto, pageNo, pageSize);
	}


	@PostMapping
	public MovieAddDTO addMovie(@RequestBody MovieAddDTO movieDTO) {
		return movieService.addMovie(movieDTO);
	}


	@PostMapping("/{id}")
	public void updateMovie(@PathVariable UUID id, @RequestBody MovieAddDTO movie) {
		movieService.updateMovie(id, movie);
	}

	@PostMapping("/delete/{id}")
	public ResponseEntity<?> deleteMovie(@PathVariable UUID id) {
		movieService.deleteMovieIfNotRented(id);
		return ResponseEntity.ok("Movie can be deleted");
	}


	@GetMapping("/{id}")
	public MovieAddDTO findMovieById(@PathVariable UUID id) {
		return movieService.findMovieByID(id);
	}
	@GetMapping("/rent/{id}")
	public MovieRentDTO findMovieToRent(@PathVariable UUID id) {
		return movieService.findMovieToRent(id);
	}


	@PostMapping("/history")
	public ResponseEntity<?> addMovieHistory(@Valid @RequestBody MovieHistoryDTO movieHistoryDTO, BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			return new ResponseEntity<>(bindingResult.getAllErrors().getFirst().getDefaultMessage(), HttpStatus.BAD_REQUEST);
		}
		Optional<String> errorOptional = movieService.validateMovieHistory(movieHistoryDTO);

		if (errorOptional.isEmpty()) {
			movieService.addMovieHistory(movieHistoryDTO);
			return new ResponseEntity<>(movieHistoryDTO, HttpStatus.CREATED);
		} else {
			return new ResponseEntity<>(errorOptional.get(), HttpStatus.BAD_REQUEST);
		}
	}
	@GetMapping("/rented")
	public Page<MovieDTO> findRentedMoviesForUser(
			@ModelAttribute MyRentedMoviesRequestDTO myRentedMoviesRequestDTO,
			@RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
			@RequestParam(name = "pageSize", defaultValue = "15") int pageSize

	) {
		return movieService.findRentedMoviesForUser(myRentedMoviesRequestDTO, pageNo, pageSize);
	}
	@PostMapping("/updateStatus/{id}")
	public void changeRentedMovieStatus (@PathVariable UUID id) {
		movieService.changeRentedMovieStatus(id);
	}

}
