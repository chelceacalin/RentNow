package com.example.RentNow.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Table
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
public class Comment {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	UUID id;

	@ManyToOne
	@JoinColumn(name = "review_id")
	Review review;

	@ManyToOne
	@JoinColumn(name = "parent_comment_id")
	Comment parentComment;

	@OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
	private List<Comment> children;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	User user;

	String comment;

	LocalDateTime created_date = LocalDateTime.now();
}
