package com.example.TechNow.TechNow.controller;

import com.example.TechNow.TechNow.dto.Movie.*;
import com.example.TechNow.TechNow.dto.MovieHistory.MovieHistoryDTO;
import com.example.TechNow.TechNow.service.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
@Slf4j
public class MovieController {

	final MovieService movieService;

	@GetMapping
	public Page<MovieDTO> findUserMovies(@ModelAttribute MovieFilterDTO dto,
										 @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
										 @RequestParam(name = "pageSize", defaultValue = "15") int pageSize) {
		log.info("Movies searched with {}", dto);
		return movieService.findUserMovies(dto, pageNo, pageSize);
	}


	@PostMapping
	public MovieAddDTO addMovie(@RequestPart("movieDTO") MovieAddDTO movieDTO, @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
		return movieService.addMovie(movieDTO, imageFile);
	}


	@PostMapping("/{id}")
	public void updateMovie(@PathVariable UUID id, @RequestPart("movieDTO") MovieAddDTO movie, @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
		movieService.updateMovie(id, movie, imageFile);
	}

	@PostMapping("/delete/{id}")
	public ResponseEntity<String> deleteMovie(@PathVariable UUID id) {
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
	public ResponseEntity<Object> addMovieHistory(@Valid @RequestBody MovieHistoryDTO movieHistoryDTO, BindingResult bindingResult) {
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
	public void changeRentedMovieStatus(@PathVariable UUID id) {
		movieService.changeRentedMovieStatus(id);
	}

}
