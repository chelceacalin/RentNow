package com.example.TechNow.TechNow.cron;

import com.example.TechNow.TechNow.model.Book;
import com.example.TechNow.TechNow.model.BookHistory;
import com.example.TechNow.TechNow.service.BookHistoryService;
import com.example.TechNow.TechNow.service.BookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@RequiredArgsConstructor
@Slf4j
public class PendingBooksCleanup {
	final BookHistoryService bookHistoryService;
	final BookService bookService;

	@Scheduled(fixedRate = 24, timeUnit = TimeUnit.HOURS)
	public void makeAvailablePendingBooks() {
		var bookHistories = bookHistoryService.findAll();
		AtomicInteger counter = new AtomicInteger(0);
		bookHistories.forEach(bookHistory -> {
			if (bookHistory.getStatus().equals(BookHistory.Status.PENDING)
				&& isMoreThan24Hours(bookHistory.getUpdated_date())) {
				bookHistory.setStatus(BookHistory.Status.REJECTED);
				bookHistory.setUpdated_date(LocalDateTime.now());
				bookHistoryService.save(bookHistory);
				Book book = bookHistory.getBook();
				book.setAvailable(true);
				book.setUpdated_date(LocalDateTime.now());
				bookService.save(book);
				counter.incrementAndGet();
			}
		});
		log.info("Total books processed: {}", counter.get());
	}

	public static boolean isMoreThan24Hours(LocalDateTime lastUpdatedDate) {
		LocalDateTime now = LocalDateTime.now();
		Duration duration = Duration.between(lastUpdatedDate, now);
		return duration.toHours() > 24;
	}
}
