package com.example.TechNow.TechNow.controller;

import com.example.TechNow.TechNow.dto.Review.ReviewAddDTO;
import com.example.TechNow.TechNow.dto.Review.ReviewAddResponseDTO;
import com.example.TechNow.TechNow.model.Review;
import com.example.TechNow.TechNow.service.ReviewService;
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
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
}
