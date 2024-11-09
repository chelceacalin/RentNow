package  com.example.RentNow.dto.Book;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookRentDTO {
	String title;
	String director;
	String ownerUsername;
	String ownerEmail;


}
