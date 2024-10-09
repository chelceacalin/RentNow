package com.example.TechNow.TechNow.mapper;

import com.example.TechNow.TechNow.dto.Book.BookAddDTO;
import com.example.TechNow.TechNow.dto.Book.BookDTO;
import com.example.TechNow.TechNow.dto.Book.BookRentDTO;
import com.example.TechNow.TechNow.dto.User.UserDTO;
import com.example.TechNow.TechNow.model.Book;
import com.example.TechNow.TechNow.model.BookHistory;
import com.example.TechNow.TechNow.model.Category;

import static com.example.TechNow.TechNow.util.Utils.parseDate;

public class BookMapper {
	public static BookDTO toDto(Book m, BookHistory mh) {
		return BookDTO.builder()
				.id(m.getId())
				.title(m.getTitle())
				.director(m.getDirector())
				.category(m.getCategory() != null ? m.getCategory().getName() : "DEFAULT")
				.description(m.getDescription())
				.isAvailable(m.isAvailable())
				.rentedBy(mh != null && mh.getRentedBy() != null ? mh.getRentedBy().getUsername() : "available")
				.owner_username(m.getOwner().getUsername())
				.owner_email(m.getOwner().getEmail())
				.rentedDate(mh != null && mh.getRentedDate() != null ? mh.getRentedDate() : null)
				.rentedUntil(mh != null && mh.getRentedUntil() != null ? mh.getRentedUntil() : null)
				.photoUrl(m.getPhotoUrl() != null ? m.getPhotoUrl() : "")
				.created_date(parseDate(m.getCreated_date()))
				.updated_date(m.getUpdated_date() != null ? m.getUpdated_date() : null)
				.build();
	}

	public static Book toBook(BookAddDTO dto, UserDTO userDTO, Category category) {
		return Book.builder()
				.title(dto.getTitle())
				.description(dto.getDescription())
				.isAvailable(dto.getIsAvailable())
				.director(dto.getDirector())
				.category(category)
				.owner(UserMapper.toUser(userDTO))
				.build();
	}

	public static BookAddDTO toBookAddDto(Book book) {
		return BookAddDTO.builder()
				.title(book.getTitle())
				.director(book.getDirector())
				.description(book.getDescription())
				.category(book.getCategory().getName())
				.owner_username(book.getOwner().getUsername())
				.owner_email(book.getOwner().getEmail())
				.isAvailable(book.isAvailable())
				.id(book.getId())
				.photoUrl(book.getPhotoUrl() != null ? book.getPhotoUrl() : "")
				.build();
	}

	public static BookRentDTO toBookRentDto(Book book) {
		return BookRentDTO.builder()
				.title(book.getTitle())
				.director(book.getDirector())
				.ownerUsername(book.getOwner().getUsername())
				.ownerEmail(book.getOwner().getEmail())
				.build();
	}
}
