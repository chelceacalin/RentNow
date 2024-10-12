package com.example.TechNow.TechNow.service;

import com.example.TechNow.TechNow.dto.Review.ReviewAddDTO;
import com.example.TechNow.TechNow.dto.Review.ReviewAddResponseDTO;
import com.example.TechNow.TechNow.mapper.ReviewMapper;
import com.example.TechNow.TechNow.model.Book;
import com.example.TechNow.TechNow.model.Review;
import com.example.TechNow.TechNow.model.User;
import com.example.TechNow.TechNow.repository.BookRepository;
import com.example.TechNow.TechNow.repository.CommentRepository;
import com.example.TechNow.TechNow.repository.UserRepository;
import com.example.TechNow.TechNow.util.ReviewRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

import static com.example.TechNow.TechNow.mapper.ReviewMapper.createFromDTO;
import static com.example.TechNow.TechNow.service.CommentService.getCommentsForReview;
import static com.example.TechNow.TechNow.util.Utils.getEntityOrThrow;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    final BookRepository bookRepository;
    final UserRepository userRepository;
    final CommentRepository commentRepository;
    final ReviewRepository reviewRepository;

    public List<ReviewAddResponseDTO> findAllByBookId(UUID bookId) {
        var reviews = reviewRepository.findAllByBookId(bookId);
        return reviews.stream().map(r -> ReviewMapper.toDTO(r, getCommentsForReview(commentRepository, r.getId()))).toList();
    }

    public Review addReview(ReviewAddDTO reviewAddDTO) {
        Book book = getEntityOrThrow(() -> bookRepository.findById(reviewAddDTO.getBook_id()), "Book has been deleted!");
        User user = getEntityOrThrow(() -> userRepository.findByEmail(reviewAddDTO.getOwner_email()), "User has been deleted!");
        log.info("User {} Adding review to book {}", user.getUsername(), book.getTitle());
        Review review = createFromDTO(reviewAddDTO, book, user);
        return reviewRepository.save(review);
    }

    @Modifying
    public void deleteReview(UUID reviewId) {
        reviewRepository.deleteById(reviewId);
        commentRepository.deleteAllByReviewId(reviewId);
    }
}
