package com.example.TechNow.TechNow.dto.Review;

import com.example.TechNow.TechNow.model.User;
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

    User user;

    LocalDateTime created_date;
}
