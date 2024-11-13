package  com.example.RentNow.service;

import  com.example.RentNow.dto.Comment.CommentAddDTO;
import  com.example.RentNow.dto.Comment.CommentAddResponseDTO;
import  com.example.RentNow.dto.Comment.CommentResponseDTO;
import  com.example.RentNow.model.Comment;
import  com.example.RentNow.model.Review;
import  com.example.RentNow.model.User;
import  com.example.RentNow.repository.CommentRepository;
import  com.example.RentNow.repository.UserRepository;
import  com.example.RentNow.util.ReviewRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static  com.example.RentNow.util.Utils.getEntityOrThrow;
import static  com.example.RentNow.util.Utils.parseDate;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

	final CommentRepository commentRepository;
	final ReviewRepository reviewRepository;
	final UserRepository userRepository;

	public CommentAddResponseDTO addComment(CommentAddDTO commentAddDTO) {
		Review review = getEntityOrThrow(() -> reviewRepository.findById(commentAddDTO.getReview_id()), "Review with id " + commentAddDTO.getReview_id() + " does not exist");
		User user = getEntityOrThrow(() -> userRepository.findByEmail(String.valueOf(commentAddDTO.getOwner_email())), "User with id " + commentAddDTO.getOwner_email() + " does not exist");
		Comment comment = new Comment()
				.setId(UUID.randomUUID())
				.setComment(commentAddDTO.getComment())
				.setUser(user)
				.setCreated_date(LocalDateTime.now())
				.setReview(review);

		if (commentAddDTO.getParent_comment_id() != null) {
			Comment parentComment = getEntityOrThrow(() -> commentRepository.findById(commentAddDTO.getParent_comment_id()), "Parent comment with id " + commentAddDTO.getParent_comment_id() + " does not exist");
			comment.setParentComment(parentComment);
		}

		commentRepository.save(comment);

		CommentAddResponseDTO commentAddResponseDTO = new CommentAddResponseDTO();
		commentAddResponseDTO
				.setId(comment.getId())
				.setComment(comment.getComment())
				.setChildren(comment.getChildren())
				.setParent(comment.getParentComment())
				.setUser(user)
				.setCreated_date(comment.getCreated_date())
				.setReview(review);

		return commentAddResponseDTO;
	}

	public static List<CommentResponseDTO> getCommentsForReview(CommentRepository commentRepository, UUID reviewId) {
		List<Comment> parents = commentRepository.findAllByReviewIdAndParentCommentIsNull(reviewId);
		List<CommentResponseDTO> responseDTOS = new ArrayList<>();
		for (Comment parentComment : parents) {
			responseDTOS.add(buildCommentHierarchy(parentComment));
		}
		return responseDTOS;
	}

	public static CommentResponseDTO buildCommentHierarchy(Comment parentComment) {
		CommentResponseDTO dto = new CommentResponseDTO();
		dto.setId(parentComment.getId());
		dto.setComment(parentComment.getComment());
		dto.setOwner_email(parentComment.getUser().getEmail());
		dto.setCreatedDate(parseDate(parentComment.getCreated_date()));
		parentComment.getChildren().forEach(child -> dto.getChildren().add(buildCommentHierarchy(child)));
		return dto;
	}

	@Transactional
	public String deleteById(UUID id) {
		try {
			Comment comment = getEntityOrThrow(() -> commentRepository.findById(id), "Comment not found with id " + id);
			if (comment.getParentComment() != null) {
				Comment parentComment = comment.getParentComment();
				parentComment.getChildren().remove(comment);
				commentRepository.save(parentComment);
			}
			commentRepository.delete(comment);
			return "Comment deleted successfully";
		} catch (Exception e) {
			return "Error deleting comment: " + e.getMessage();
		}
	}

}
