package com.example.TechNow.TechNow.controller;

import com.example.TechNow.TechNow.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
public class ReportController extends BaseController {

	final ReportService reportService;

	@GetMapping("/download-pdf/{email}")
	public ResponseEntity<byte[]> downloadJson(@PathVariable(name = "email") String email) {
		try {
			String date = LocalDateTime.now().toString();
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_PDF);
			headers.setContentDispositionFormData("attachment", "filename.pdf");
			return ResponseEntity.ok().headers(headers).body(reportService.generateTable(email));
		} catch (Exception e) {
			throw new RuntimeException(e.getMessage());
		}
	}
}
