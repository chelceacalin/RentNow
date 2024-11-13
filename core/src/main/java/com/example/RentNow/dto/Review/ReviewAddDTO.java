package  com.example.RentNow.dto.Review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ReviewAddDTO {
    UUID book_id;

    String owner_email;

    @Min(value = 0)
    @Max(value = 5)
    float rating;

    @Min(value = 0)
    @Max(value = 5)
    float state;

    String text;

}
