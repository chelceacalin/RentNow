package com.example.TechNow.TechNow.dto.Comment;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentAddDTO {

	UUID review_id;

	UUID parent_comment_id;

	String owner_email;

	String comment;

	LocalDateTime created_date = LocalDateTime.now();
}