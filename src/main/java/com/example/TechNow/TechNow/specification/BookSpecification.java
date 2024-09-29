package com.example.TechNow.TechNow.specification;

import com.example.TechNow.TechNow.model.Book;
import com.example.TechNow.TechNow.model.Category;
import com.example.TechNow.TechNow.model.BookHistory;
import com.example.TechNow.TechNow.model.User;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static com.example.TechNow.TechNow.util.BookSpecificationConstants.*;

public class BookSpecification {


	public static <T> Specification<T> hasUsername(String username) {
		return (root, query, criteriaBuilder) -> {
			if (username == null) return null;
			return criteriaBuilder.equal(root.get(OWNER).get(USERNAME), username);
		};
	}

	public static <T> Specification<T> hasCategory(String categoryName) {
		return (root, query, criteriaBuilder) -> {
			Join<Book, Category> categoryJoin = root.join(CATEGORY_FIELD);
			return criteriaBuilder.like(criteriaBuilder.lower(categoryJoin.get(NAME)), "%" + categoryName.toLowerCase() + "%");
		};
	}

	public static <T> Specification<T> rentedDateFieldEquals(LocalDate rentedDateField, String column) {
		return (root, query, criteriaBuilder) -> {
			Join<Book, BookHistory> bookBookHistoryJoin = root.join(BOOK_HISTORIES);
			return criteriaBuilder.equal(bookBookHistoryJoin.get(column), rentedDateField);
		};
	}

	public static <T> Specification<T> getRentedBy(String username) {
		return (root, query, criteriaBuilder) -> {
			Join<Book, BookHistory> bookBookHistoryJoin = root.join(BOOK_HISTORIES, JoinType.INNER);
			Join<BookHistory, User> rentedByJoin = bookBookHistoryJoin.join(RENTED_BY, JoinType.INNER);
			return criteriaBuilder.like(criteriaBuilder.lower(rentedByJoin.get(USERNAME)), "%" + username.toLowerCase() + "%");
		};
	}

	public static <T> Specification<T> createdDateEquals(LocalDateTime createdDate, String column) {
		return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get(column), createdDate);
	}
}
