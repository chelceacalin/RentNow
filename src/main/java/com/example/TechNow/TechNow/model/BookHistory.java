package com.example.TechNow.TechNow.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Table
@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	UUID id;

	LocalDate rentedDate;

	LocalDate rentedUntil;

	Integer rating;

	String description;

	@Enumerated(EnumType.STRING)
	Status status;

	@OneToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	User rentedBy;

	@ManyToOne
	@JoinColumn(name = "book_id", referencedColumnName = "id")
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
		REJECTED("REJECTED");

		private final String value;

		Status(String value) {
			this.value = value;
		}
	}

}
