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
	private LocalDate rentedDate;
	@RentDateConstraint
	private LocalDate rentedUntil;
	private Integer rating;
	private String description;
	private UUID movieId;
	private UUID userId;
}
