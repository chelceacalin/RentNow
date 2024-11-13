package com.example.RentNow.dto.BookHistory;

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
public class BookHistoryDTO {
	LocalDate rentedDate;
	LocalDate rentedUntil;
	Integer rating;
	String description;
	UUID bookId;
	UUID userId;
	String status;
}
