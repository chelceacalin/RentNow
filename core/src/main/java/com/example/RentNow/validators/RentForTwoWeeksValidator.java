package  com.example.RentNow.validators;

import  com.example.RentNow.dto.BookHistory.BookHistoryDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.Duration;
import java.time.LocalDate;

public class RentForTwoWeeksValidator implements ConstraintValidator<RentForTwoWeeksConstraint, BookHistoryDTO> {
	@Override
	public void initialize(RentForTwoWeeksConstraint constraintAnnotation) {
		ConstraintValidator.super.initialize(constraintAnnotation);
	}

	@Override
	public boolean isValid(BookHistoryDTO bookHistoryDTO, ConstraintValidatorContext constraintValidatorContext) {
		if (bookHistoryDTO == null) {
			return true;
		}

		LocalDate rentedDate = bookHistoryDTO.getRentedDate() != null ? bookHistoryDTO.getRentedDate() : LocalDate.now();
		LocalDate rentedUntil = bookHistoryDTO.getRentedUntil() != null ? bookHistoryDTO.getRentedUntil() : LocalDate.now();


		long daysBetween = Duration.between(rentedDate.atStartOfDay(), rentedUntil.atStartOfDay()).toDays();

		return daysBetween <= 14;
	}
}
