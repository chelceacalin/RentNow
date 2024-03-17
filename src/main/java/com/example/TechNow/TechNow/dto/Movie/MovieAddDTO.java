package com.example.TechNow.TechNow.dto.Movie;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieAddDTO {

	UUID id;

	String owner_username;

	String owner_email;

	String title;

	String director;

	String category;

	Boolean isAvailable;

	String description;

	String photoUrl;
}