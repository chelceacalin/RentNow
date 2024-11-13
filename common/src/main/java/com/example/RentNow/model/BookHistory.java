package com.example.RentNow.model;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookHistory {
	UUID id;
	LocalDate rentedDate;
	LocalDate rentedUntil;
	Integer rating;
	String description;
	Status status;
	User rentedBy;
	Book book;
	LocalDateTime created_date;
	LocalDateTime updated_date;

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		BookHistory that = (BookHistory) o;
		return Objects.equals(rentedBy, that.rentedBy) &&
			   Objects.equals(book, that.book);
	}

	@Override
	public int hashCode() {
		return Objects.hash(rentedBy, book);
	}

	@Getter
	@ToString
	public enum Status {
		PENDING("PENDING"),
		APPROVED("APPROVED"),
		REJECTED("REJECTED"),
		RETURNED("RETURNED"),
		FAILED_RETURNING("FAILED RETURNING"),
		PENDING_CONFIRMATION("PENDING_CONFIRMATION");

		private final String value;

		Status(String value) {
			this.value = value;
		}
	}
}
