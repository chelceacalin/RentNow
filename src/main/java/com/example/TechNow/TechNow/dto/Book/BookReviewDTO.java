package com.example.TechNow.TechNow.dto.Book;


import com.example.TechNow.TechNow.dto.Review.ReviewAddResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookReviewDTO {

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

	LocalDateTime updated_date;

	List<ReviewAddResponseDTO> reviewAddResponseDTOS;
}