package com.example.RentNow.dto.Email;


import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@Data
@RequiredArgsConstructor
public class EmailDTO {
	String renterUsername;
	String renterEmail;
	String bookTitle;
	String ownerEmail;
	String ownerUsername;
	String status;
	UUID bookHistoryId;
	String rejectReason;
}
