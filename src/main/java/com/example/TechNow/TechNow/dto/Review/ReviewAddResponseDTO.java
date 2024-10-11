package com.example.TechNow.TechNow.dto.Review;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class ReviewAddResponseDTO {
    UUID id;

    String text;

    float state;

    float rating;

    LocalDateTime created_date;
}
