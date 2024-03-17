package com.example.TechNow.TechNow.dto.MovieHistory;

import com.example.TechNow.TechNow.validators.RentDateConstraint;
import com.example.TechNow.TechNow.validators.RentForTwoWeeksConstraint;
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
public class MovieHistoryDTO {
	@RentDateConstraint
	LocalDate rentedDate;

	@RentDateConstraint
	LocalDate rentedUntil;

	Integer rating;

	String description;

	UUID movieId;

	UUID userId;
}
