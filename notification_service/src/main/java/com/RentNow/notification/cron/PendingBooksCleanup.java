package com.RentNow.notification.cron;

import com.RentNow.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
@Slf4j
@RequiredArgsConstructor
public class PendingBooksCleanup {

	final NotificationService notificationService;
	@Scheduled(fixedRate = 24, timeUnit = TimeUnit.HOURS)
	public void makeAvailablePendingBooks() {
		log.info("[makeAvailablePendingBooks] start");
		notificationService.makeAvailablePendingBooks();
		log.info("[makeAvailablePendingBooks] end");
	}
}
