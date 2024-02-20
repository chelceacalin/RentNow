package com.example.TechNow.TechNow.controller;

import com.example.TechNow.TechNow.dto.Movie.MovieAddDTO;
import com.example.TechNow.TechNow.dto.Movie.MovieDTO;
import com.example.TechNow.TechNow.dto.Movie.MovieFilterDTO;
import com.example.TechNow.TechNow.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

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



}
