package com.example.TechNow.TechNow.dto.Movie;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieDTO {

	UUID id;

	String owner_username;

	String owner_email;

	String title;

	String director;

	String category;

	String description;

	Boolean isAvailable;

	String rentedBy;

	LocalDate rentedDate;

	LocalDate rentedUntil;

	String photoUrl;

	String created_date;

	LocalDateTime updated_date;
}