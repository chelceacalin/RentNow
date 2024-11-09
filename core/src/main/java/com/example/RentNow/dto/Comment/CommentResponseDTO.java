package  com.example.RentNow.dto.Comment;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class CommentResponseDTO {
	UUID id;
	String comment;
	String owner_email;
	List<CommentResponseDTO> children = new ArrayList<>();
	String createdDate;
}
