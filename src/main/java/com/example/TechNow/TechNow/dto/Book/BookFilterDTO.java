package com.example.TechNow.TechNow.dto.Book;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class BookFilterDTO {

	String owner_email;

	String owner_username;

	String title;

	String director;

	String category;

	Boolean isAvailable;

	String rentedBy;

	LocalDate rentedDate;

	LocalDate rentedUntil;

	String direction;

	String sortField;

	LocalDateTime created_date;

	public BookFilterDTO() {
		this.direction = "ASC";
		this.sortField = "title";
	}
}
