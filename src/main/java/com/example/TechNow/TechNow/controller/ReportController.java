package com.example.TechNow.TechNow.controller;

import com.example.TechNow.TechNow.service.EmailSenderService;
import com.example.TechNow.TechNow.service.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
@Slf4j
public class ReportController extends BaseController {

	final ReportService reportService;
	final EmailSenderService emailSenderService;

	@GetMapping("/download-pdf/{email}")
	public ResponseEntity<Object> downloadJson(@PathVariable(name = "email") String email, @RequestParam(name = "month", required = false) String month,
											   @RequestParam(name = "wantCopyOnEmail", required = false) boolean wantCopyOnEmail) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_PDF);
		headers.setContentDispositionFormData("attachment", "filename.pdf");
		log.info("Generating report for user with email {} for month {} with copy? {}", email, month, wantCopyOnEmail);

		byte[] pdfData = reportService.generateTable(email, month);

		if (wantCopyOnEmail) {
			emailSenderService.sendEmail(email, "Copy of your book report", "Hi, " + email + ", here is a copy of your book report that you requested", pdfData);
		}

		return buildOkResponse(pdfData, headers);
	}
}
