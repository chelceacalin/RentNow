package com.example.RentNow.model;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
@Builder
public class Book {
	UUID id;
	String title;
	String director;
	String description;
	boolean isAvailable;
	Category category;
	User owner;
	List<BookHistory> bookHistories;
	String photoUrl;
	LocalDateTime created_date;
	LocalDateTime updated_date;
}
