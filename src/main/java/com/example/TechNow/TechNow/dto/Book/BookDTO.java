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
public class BookDTO {

	UUID id;

	String owner_username;

	String owner_email;

	String title;

	String director;

	String category;

	String description;

	Boolean isAvailable;

	String rentedBy;

	String rentedDate;

	String rentedUntil;

	String photoUrl;

	String created_date;

	String updated_date;

	String status;
}