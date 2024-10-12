package com.example.TechNow.TechNow.dto.Comment;


import com.example.TechNow.TechNow.model.Comment;
import com.example.TechNow.TechNow.model.Review;
import com.example.TechNow.TechNow.model.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class CommentAddResponseDTO {

	UUID id;

	Review review;

	Comment parent;

	List<Comment> children = new ArrayList<>();

	User user;

	String comment;

	LocalDateTime created_date = LocalDateTime.now();
}