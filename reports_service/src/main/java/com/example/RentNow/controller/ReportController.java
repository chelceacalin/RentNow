package com.example.RentNow.controller;

import com.example.RentNow.dto.Report.ReportRequest;
import com.example.RentNow.service.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController extends BaseController {

	final PdfService pdfService;

	@PostMapping("/generate")
	public ResponseEntity<Object> generatePdf(@RequestBody ReportRequest reportRequest) {
		byte[] pdfData = pdfService.generateTable(reportRequest.getEmail(), reportRequest.getMonth(), reportRequest.isAdmin());
		return buildOkResponse(pdfData);
	}
}
