package  com.example.RentNow.dto.Comment;


import  com.example.RentNow.model.Comment;
import  com.example.RentNow.model.Review;
import  com.example.RentNow.model.User;
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