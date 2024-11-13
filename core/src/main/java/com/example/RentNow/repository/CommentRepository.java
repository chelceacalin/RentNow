package  com.example.RentNow.repository;

import  com.example.RentNow.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {

	List<Comment> findAllByReviewIdAndParentCommentIsNull(UUID reviewID);

	void deleteAllByReviewId(UUID reviewID);

}
