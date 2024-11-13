package  com.example.RentNow.dto.BookHistory;

import  com.example.RentNow.validators.RentDateConstraint;
import  com.example.RentNow.validators.RentForTwoWeeksConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@RentForTwoWeeksConstraint
public class BookHistoryDTO {
	@RentDateConstraint
	LocalDate rentedDate;

	@RentDateConstraint
	LocalDate rentedUntil;

	Integer rating;

	String description;

	UUID bookId;

	UUID userId;

	String status;
}
