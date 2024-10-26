package com.example.TechNow.TechNow.mapper;

import com.example.TechNow.TechNow.dto.BookHistory.BookHistoryDTO;
import com.example.TechNow.TechNow.model.Book;
import com.example.TechNow.TechNow.model.BookHistory;
import com.example.TechNow.TechNow.model.User;

import java.time.LocalDateTime;
import java.util.UUID;

public class BookHistoryMapper {
	public static BookHistory toBookHistory(BookHistoryDTO bookHistoryDTO) {
		Book book = new Book();
		book.setId(bookHistoryDTO.getBookId());

		User user = new User();
		user.setId(String.valueOf(bookHistoryDTO.getUserId()));

		return BookHistory.builder()
				.id(UUID.randomUUID())
				.description(bookHistoryDTO.getDescription())
				.rating(bookHistoryDTO.getRating())
				.rentedDate(bookHistoryDTO.getRentedDate())
				.rentedUntil(bookHistoryDTO.getRentedUntil())
				.book(book)
				.created_date(LocalDateTime.now())
				.updated_date(LocalDateTime.now())
				.rentedBy(user)
				.build();
	}
}
