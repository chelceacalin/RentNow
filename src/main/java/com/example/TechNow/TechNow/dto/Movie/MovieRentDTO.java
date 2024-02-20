package com.example.TechNow.TechNow.dto.Movie;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MovieRentDTO {
	String title;
	String director;
	String ownerUsername;
	String ownerEmail;


}
