package com.example.RentNow.controller;

import com.example.RentNow.service.CronService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cron")
@RequiredArgsConstructor
public class CronController extends BaseController {

	final CronService cronService;

	@Value("${custom.enableMailService}")
	Boolean isMailNotificationEnabled;

	@GetMapping("/cleanPendingBooks")
	public ResponseEntity<Object> cleanUpPendingBooks() {
		cronService.makeLongStandingPendingBooksAvailable();
		return buildOkResponse(mailNotificationMessage() + "Successfully cleaned up pending books");
	}

	@GetMapping("/sendNewsletter")
	public ResponseEntity<Object> sendNewsletter() {
		cronService.sendNewsLetterNotification();
		return buildOkResponse(mailNotificationMessage() + "Successfully sent newsletter, mail notification enabled");
	}

	@GetMapping("/sendLateBooksNotificaton")
	public ResponseEntity<Object> sendLateBooksNotifications() {
		cronService.sendLateBooksNotificatons();
		return buildOkResponse(mailNotificationMessage() + "Successfully sent late books notifications");
	}

	String mailNotificationMessage() {
		return "[MAIL_ENABLED: " + isMailNotificationEnabled + "]: ";
	}
}
