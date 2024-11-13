package com.example.RentNow.dto.Report;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportRequest {
	String email;
	String month;
	boolean isAdmin;
	boolean wantCopyOnEmail;
}
