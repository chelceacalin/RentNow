package  com.example.RentNow.mapper;

import  com.example.RentNow.dto.Comment.CommentResponseDTO;
import  com.example.RentNow.dto.Review.ReviewAddDTO;
import  com.example.RentNow.dto.Review.ReviewAddResponseDTO;
import  com.example.RentNow.model.Book;
import  com.example.RentNow.model.Review;
import  com.example.RentNow.model.User;
import  com.example.RentNow.util.Utils;
import org.springframework.beans.BeanUtils;

import java.time.LocalDateTime;
import java.util.List;
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


	public static ReviewAddResponseDTO toDTO(Review review, List<CommentResponseDTO> commentResponseDTOS) {
		ReviewAddResponseDTO dto = new ReviewAddResponseDTO();
		BeanUtils.copyProperties(review, dto);
		dto.setId(review.getId());
		dto.setUser(review.getUser());
		dto.setCreated_date(Utils.parseDate(review.getCreated_date()));
		dto.setComments(commentResponseDTOS);
		return dto;
	}
}
