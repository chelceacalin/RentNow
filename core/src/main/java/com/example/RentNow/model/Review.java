package  com.example.RentNow.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Table
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
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
    @Max(value = 5)
    float rating;

    @Min(value = 0)
    @Max(value = 5)
    float state;

    String text;

    LocalDateTime created_date = LocalDateTime.now();
}
