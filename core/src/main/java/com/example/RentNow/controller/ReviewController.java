package  com.example.RentNow.controller;

import  com.example.RentNow.dto.Review.ReviewAddDTO;
import  com.example.RentNow.dto.Review.ReviewAddResponseDTO;
import  com.example.RentNow.model.Review;
import  com.example.RentNow.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/reviews")
@Slf4j
public class ReviewController {

    final ReviewService reviewService;

    @GetMapping("/book/{id}")
    public List<ReviewAddResponseDTO> getReviewsByBookId(@PathVariable(name = "id") UUID bookId) {
        return reviewService.findAllByBookId(bookId);
    }

    @PostMapping
    public Review addReview(@RequestBody ReviewAddDTO reviewAddDTO) {
        try {
            return reviewService.addReview(reviewAddDTO);
        } catch (Exception e) {
            log.error("Add review error: {}", e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable(name = "id") UUID reviewId) {
        reviewService.deleteReview(reviewId);
    }
}
