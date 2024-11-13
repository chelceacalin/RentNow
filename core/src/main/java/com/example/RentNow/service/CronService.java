package com.example.RentNow.service;

import com.example.RentNow.config.BaseUrlRestTemplate;
import com.example.RentNow.dto.Book.BookDtoSuggestion;
import com.example.RentNow.model.Book;
import com.example.RentNow.model.BookHistory;
import com.example.RentNow.model.NewsLetterSubscription;
import com.example.RentNow.model.User;
import com.example.RentNow.util.TokenUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static com.example.RentNow.util.EmailConstants.MAIL;
import static com.example.RentNow.util.EmailConstants.RENTNOW;

@Service
@Slf4j
public class CronService {

	final BookHistoryService bookHistoryService;
	final BookService bookService;
	final UserService userService;
	final EmailSenderService emailSenderService;
	final BaseUrlRestTemplate pythonServiceTemplate;
	final ObjectMapper objectMapper;
	final TokenUtils tokenUtils;
	final NewsletterService newsletterService;

	@Value("${custom.frontend.app-url}")
	String frontEndUrl;


	public CronService(EmailSenderService emailSenderService, ObjectMapper objectMapper,
					   @Qualifier("pythonServiceTemplate") BaseUrlRestTemplate pythonServiceTemplate,
					   UserService userService, TokenUtils tokenUtils, NewsletterService newsletterService,
					   BookHistoryService bookHistoryService, BookService bookService) {
		this.emailSenderService = emailSenderService;
		this.objectMapper = objectMapper;
		this.pythonServiceTemplate = pythonServiceTemplate;
		this.userService = userService;
		this.tokenUtils = tokenUtils;
		this.newsletterService = newsletterService;
		this.bookHistoryService = bookHistoryService;
		this.bookService = bookService;
	}

	public void makeLongStandingPendingBooksAvailable() {
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


	private String generateNewsLetterBody(List<BookDtoSuggestion> suggestions, String token) {
		StringBuilder str = new StringBuilder();
		str.append("<html>");
		str.append("<body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>");

		str.append("<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);'>");
		str.append("<h2 style='text-align: center; color: #333333;'>📚 Book Recommendations Just for You! 📚</h2>");
		str.append("<p style='text-align: center; color: #666666;'>Dive into these handpicked books we think you'll love. Happy reading!</p>");
		str.append("<hr style='border: none; height: 1px; background-color: #e0e0e0;'>");

		for (BookDtoSuggestion suggestion : suggestions) {
			str.append("<div style='padding: 10px 0;'>");
			str.append("<h3 style='color: #0056b3; margin: 0;'>").append(suggestion.title()).append("</h3>");
			str.append("<p style='margin: 5px 0; color: #888888;'>Category: ").append(suggestion.category()).append("</p>");
			str.append("</div>");
			str.append("<hr style='border: none; height: 1px; background-color: #e0e0e0;'>");
		}

		str.append("<p style='text-align: center; color: #333333;'>Thank you for subscribing to our newsletter!</p>");
		str.append("<p style='text-align: center; color: #666666; font-size: 12px;'>If you wish to unsubscribe, please <a href='")
				.append(frontEndUrl)
				.append("/subscriptions/unsubscribe/")
				.append(token)
				.append("' target='_blank' style='color: #0056b3;'>click here</a>.</p>");

		str.append("</div>");
		str.append("</body>");
		str.append("</html>");
		return str.toString();
	}

	public void sendNewsLetterNotification(){
		try {
			log.info("{}: Starting sending newsletter notifications ", LocalDate.now());
			var users = userService.findAll();
			users.forEach(user -> {
				NewsLetterSubscription subscription = newsletterService.findByUserEmail(user.getEmail());
				if (user.isMailNotificationsEnabled() && subscription != null && subscription.isSubscribed()) {
					String userEmail = user.getEmail();

					String ans = pythonServiceTemplate.getForObject("/get_recommendations/" + userEmail, String.class);
					try {
						List<BookDtoSuggestion> suggestions = objectMapper.readValue(ans, new TypeReference<>() {
						});

						String token = tokenUtils.generateToken(userEmail);
						subscription.setToken(token);
						subscription.setUpdated_date(LocalDateTime.now());
						newsletterService.save(subscription);
						String body = generateNewsLetterBody(suggestions, token);
						emailSenderService.sendEmail(userEmail, "[RentNow] Weekly Newsletter", body, null);
					} catch (Exception e) {
						log.error("Error parsing response");
					}
				}
			});
			log.info("{}: Finished sending newsletter notifications ", LocalDate.now());
		} catch (Exception e) {
			log.error("{}: Error sending newsletter notifications", LocalDate.now());
		}
	}

	public void sendLateBooksNotificatons() {
		log.info(MAIL + "Sending reminders to users ");
		List<BookHistory> bookHistories = bookHistoryService.findAll();

		Map<User, List<Book>> lateBooksMap = new HashMap<>();
		Map<User, List<Book>> almostlateBooksMap = new HashMap<>();
		bookHistories.forEach(bh -> {
			LocalDate rentedUntil = bh.getRentedUntil();
			User user = bh.getRentedBy();
			Book book = bh.getBook();

			if (LocalDate.now().isAfter(rentedUntil)) {
				lateBooksMap.computeIfAbsent(user, k -> new ArrayList<>()).add(book);
			}

			if (ChronoUnit.DAYS.between(bh.getRentedUntil(), rentedUntil) <= 1) {
				almostlateBooksMap.computeIfAbsent(user, k -> new ArrayList<>()).add(book);
			}
		});
		sendLateBooksEmails(lateBooksMap);
		sendAlmostLateBooksEmails(almostlateBooksMap);
	}

	private void sendAlmostLateBooksEmails(Map<User, List<Book>> lateBooksMap) {
		lateBooksMap.forEach((user, lateBooks) -> {
			String bookTitles = lateBooks.stream()
					.map(Book::getTitle)
					.collect(Collectors.joining(", "));

			String emailSubject = String.format("%s You have 1 more day to return the rented books", RENTNOW);

			String emailBody = String.format(
					"<html>" +
					"<body>" +
					"<p>Hello %s,</p>" +
					"<p>You have 1 more day to return the rented books: <strong>%s</strong>.</p>" +
					"<p>Please return them as soon as possible to avoid any late fees.</p>" +
					"<br>" +
					"<p>Thank you for using RentNow!</p>" +
					"<br>" +
					"<p>Best regards,<br>RentNow Team</p>" +
					"</body>" +
					"</html>",
					user.getUsername(), bookTitles
			);
			emailSenderService.sendEmail(user.getEmail(), emailSubject, emailBody, null);
		});
	}


	private void sendLateBooksEmails(Map<User, List<Book>> lateBooksMap) {
		lateBooksMap.forEach((user, lateBooks) -> {
			String bookTitles = lateBooks.stream()
					.map(Book::getTitle)
					.collect(Collectors.joining(", "));

			String emailSubject = String.format("%s You have exceeded the time limit to return your rented books", RENTNOW);

			String emailBody = String.format(
					"<html>" +
					"<body>" +
					"<p>Hello %s,</p>" +
					"<p>You have exceeded the time limit to return the following books: <strong>%s</strong>.</p>" +
					"<p>Please return them as soon as possible to avoid any late fees.</p>" +
					"<br>" +
					"<p>Thank you for using RentNow!</p>" +
					"<br>" +
					"<p>Best regards,<br>RentNow Team</p>" +
					"</body>" +
					"</html>",
					user.getUsername(), bookTitles
			);
			emailSenderService.sendEmail(user.getEmail(), emailSubject, emailBody, null);
		});
	}


}
