package com.example.TechNow.TechNow.specification;

import com.example.TechNow.TechNow.model.Category;
import com.example.TechNow.TechNow.model.Movie;
import com.example.TechNow.TechNow.model.MovieHistory;
import com.example.TechNow.TechNow.model.User;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

import static com.example.TechNow.TechNow.util.MovieSpecificationConstants.*;

public class MovieSpecification {


	public static <T> Specification<T> hasUsername(String username) {
		return (root, query, criteriaBuilder) -> {
			if (username == null) return null;
			return criteriaBuilder.equal(root.get(OWNER).get(USERNAME), username);
		};
	}

	public static <T> Specification<T> hasCategory(String categoryName) {
		return (root, query, criteriaBuilder) -> {
			Join<Movie, Category> categoryJoin = root.join(CATEGORY_FIELD);
			return criteriaBuilder.like(criteriaBuilder.lower(categoryJoin.get(NAME)), "%" + categoryName.toLowerCase() + "%");
		};
	}

	public static <T> Specification<T> rentedDateFieldEquals(LocalDate rentedDateField, String column) {
		return (root, query, criteriaBuilder) -> {
			Join<Movie, MovieHistory> movieHistoryJoin = root.join(MOVIE_HISTORIES);
			return criteriaBuilder.equal(movieHistoryJoin.get(column), rentedDateField);
		};
	}

	public static <T> Specification<T> getRentedBy(String username) {
		return (root, query, criteriaBuilder) -> {
			Join<Movie, MovieHistory> movieHistoryJoin = root.join(MOVIE_HISTORIES, JoinType.INNER);
			Join<MovieHistory, User> rentedByJoin = movieHistoryJoin.join(RENTED_BY, JoinType.INNER);
			return criteriaBuilder.like(criteriaBuilder.lower(rentedByJoin.get(USERNAME)), "%" + username.toLowerCase() + "%");
		};
	}
}
