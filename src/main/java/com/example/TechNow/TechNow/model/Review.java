package com.example.TechNow.TechNow.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Table
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    Book book;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Min(value = 0)
    @Max(value = 10)
    int rating;

    @Min(value = 0)
    @Max(value = 10)
    int state;

    String text;

    LocalDateTime created_date = LocalDateTime.now();
}
