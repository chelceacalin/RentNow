package  com.example.RentNow.dto.Review;

import  com.example.RentNow.dto.Comment.CommentResponseDTO;
import  com.example.RentNow.model.User;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class ReviewAddResponseDTO {
    UUID id;

    String text;

    float state;

    float rating;

    User user;

    String created_date;

    List<CommentResponseDTO> comments = new ArrayList<>();
}
