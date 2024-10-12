package com.example.TechNow.TechNow.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "book")
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
@Builder
public class Book {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	UUID id;

	String title;

	String director;

	String description;

	@Column(name = "is_available")
	boolean isAvailable;

	@ManyToOne
	@JoinColumn(name = "category_id", referencedColumnName = "id")
	Category category;

	@ManyToOne
	@JoinColumn(name = "owner_id", referencedColumnName = "id")
	User owner;

	@OneToMany(mappedBy = "book", fetch = FetchType.LAZY)
	@JsonIgnore
	List<BookHistory> bookHistories;

	String photoUrl;


	@CreatedDate
	@Column(name = "created_date")
	LocalDateTime created_date;

	LocalDateTime updated_date;
}
