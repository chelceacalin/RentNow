package  com.example.RentNow.controller;

import com.example.RentNow.dto.Report.ReportRequest;
import com.example.RentNow.util.EmailSenderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
@Slf4j
public class ReportController extends BaseController {

	final EmailSenderService emailSenderService;
	final RestTemplate restTemplate;

	final String reportingServiceUrl = "http://localhost:8092/reports/generate";


	@GetMapping("/download-pdf/{email}")
	public ResponseEntity<Object> downloadJson(@PathVariable(name = "email") String email,
											   @RequestParam(name = "month", required = false) String month,
											   @RequestParam(name = "wantCopyOnEmail", required = false) boolean wantCopyOnEmail,
											   @RequestParam(name = "isAdmin", required = false) boolean isAdmin) {
		log.info("Generating report for " + email);
		ReportRequest request = new ReportRequest();
		request.setEmail(email);
		request.setMonth(month);
		request.setWantCopyOnEmail(wantCopyOnEmail);
		request.setAdmin(isAdmin);

		ResponseEntity<byte[]> entity = restTemplate.postForEntity(reportingServiceUrl, request, byte[].class);
		byte[] pdfData = entity.getBody();

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_PDF);
		headers.setContentDispositionFormData("attachment", "filename.pdf");
		log.info("Generating report for user with email {} for month {} with copy on email: {}, isAdmin: {}", email, month, wantCopyOnEmail, isAdmin);

		if (wantCopyOnEmail) {
			emailSenderService.sendEmail(email, "Copy of your book report", "Hi, " + email + ", here is a copy of your book report that you requested", pdfData);
		}

		return buildOkResponse(pdfData, headers);
	}
}
