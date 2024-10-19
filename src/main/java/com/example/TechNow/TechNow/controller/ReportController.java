package com.example.TechNow.TechNow.controller;

import com.example.TechNow.TechNow.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
public class ReportController extends BaseController {

	private static final Logger log = LoggerFactory.getLogger(ReportController.class);
	final ReportService reportService;

	@GetMapping("/download-pdf/{email}")
	public ResponseEntity<Object> downloadJson(@PathVariable(name = "email") String email, @RequestParam(name = "month", required = false) String month) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_PDF);
		headers.setContentDispositionFormData("attachment", "filename.pdf");
		log.info("Generating report for user with email {} for month {}", email, month);
		return buildOkResponse(reportService.generateTable(email, month), headers);
	}
}
