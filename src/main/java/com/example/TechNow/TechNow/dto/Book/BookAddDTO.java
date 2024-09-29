package com.example.TechNow.TechNow.dto.Book;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookAddDTO {

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