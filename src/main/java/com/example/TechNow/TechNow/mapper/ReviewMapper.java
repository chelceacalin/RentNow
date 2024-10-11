package com.example.TechNow.TechNow.mapper;

import com.example.TechNow.TechNow.dto.Review.ReviewAddDTO;
import com.example.TechNow.TechNow.dto.Review.ReviewAddResponseDTO;
import com.example.TechNow.TechNow.model.Book;
import com.example.TechNow.TechNow.model.Review;
import com.example.TechNow.TechNow.model.User;
import org.springframework.beans.BeanUtils;

import java.time.LocalDateTime;
import java.util.UUID;

public class ReviewMapper {

	public static Review createFromDTO(ReviewAddDTO dto, Book book, User user) {
		Review review = new Review();
		review.setId(UUID.randomUUID());
		review.setBook(book);
		review.setUser(user);
		BeanUtils.copyProperties(dto, review);
		review.setCreated_date(LocalDateTime.now());
		return review;
	}


	public static ReviewAddResponseDTO toDTO(Review review) {
		ReviewAddResponseDTO dto = new ReviewAddResponseDTO();
		BeanUtils.copyProperties(review, dto);
		dto.setId(review.getId());
		return dto;
	}
}
