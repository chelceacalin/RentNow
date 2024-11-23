package com.RentNow.notification.controller;

import com.RentNow.notification.service.NotificationService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/notification")
@RequiredArgsConstructor
@RestController
public class Controller {

	final NotificationService notificationService;

	@GetMapping("/makeAvailablePendingBooks")
	public void triggerMakeAvailablePendingBooks() {
		notificationService.makeAvailablePendingBooks();
	}

	@GetMapping("/sendLateBooksNotification")
	public void sendLateBooksNotification() {
		notificationService.sendLateBooksNotification();
	}

	@GetMapping("/sendNewsLetterNotification")
	public void sendNewsLetterNotification() {
		notificationService.sendNewsLetterNotification();
	}
}
