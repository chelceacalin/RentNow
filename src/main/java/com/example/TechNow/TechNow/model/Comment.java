package com.example.TechNow.TechNow.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Table
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    UUID id;

    @ManyToOne
    @JoinColumn(name = "review_id")
    Review review;

    @ManyToOne
    @JoinColumn(name = "parent_comment_id")
    Comment parentComment;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> children;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    String comment;

    LocalDateTime created_date = LocalDateTime.now();
}
