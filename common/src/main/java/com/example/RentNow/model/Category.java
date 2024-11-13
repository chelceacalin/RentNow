package com.example.RentNow.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Category {
	UUID id;
	String name;
	boolean isAvailable;
	List<Book> bookList;
	LocalDateTime created_date;
	LocalDateTime updated_date;
}
