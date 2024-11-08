package com.example.TechNow.TechNow.cron;

import com.example.TechNow.TechNow.config.BaseUrlRestTemplate;
import com.example.TechNow.TechNow.service.EmailSenderService;
import com.example.TechNow.TechNow.service.UserService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class NewsLetter {

	final UserService userService;
	final EmailSenderService emailSenderService;
	final BaseUrlRestTemplate pythonServiceTemplate;
	final ObjectMapper objectMapper;

	public NewsLetter(EmailSenderService emailSenderService, ObjectMapper objectMapper,
					  @Qualifier("pythonServiceTemplate") BaseUrlRestTemplate pythonServiceTemplate, UserService userService) {
		this.emailSenderService = emailSenderService;
		this.objectMapper = objectMapper;
		this.pythonServiceTemplate = pythonServiceTemplate;
		this.userService = userService;
	}

	@Scheduled(fixedRate = 15, timeUnit = TimeUnit.SECONDS)
	public void sendNewsletter() {
		try {
			log.info("{}: Starting sending newsletter notifications ", LocalDate.now());
			var users = userService.findAll();
			users.forEach(user -> {
				if (user.isMailNotificationsEnabled() && user.isSubscribedToNewsletter()) {
					String userEmail = user.getEmail();

					String ans = pythonServiceTemplate.getForObject("/get_recommendations/" + userEmail, String.class);
					try {
						List<BookDtoSuggestion> suggestions = objectMapper.readValue(ans, new TypeReference<>() {
						});

						String body = generateNewsLetterBody(suggestions);
						emailSenderService.sendEmail(userEmail, "[RentNow] Weekly Newsletter", body, null);
					} catch (Exception e) {
						log.error("Error parsing reponse");
					}
				}
			});
			log.info("{}: Finished sending newsletter notifications ", LocalDate.now());
		} catch (Exception e) {
			log.error("{}: Error sending newsletter notifications", LocalDate.now());
		}
	}

	private String generateNewsLetterBody(List<BookDtoSuggestion> suggestions) {
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
		str.append("<p style='text-align: center; color: #666666; font-size: 12px;'>If you wish to unsubscribe, please <a href='#' style='color: #0056b3;'>click here</a>.</p>");

		str.append("</div>");
		str.append("</body>");
		str.append("</html>");
		return str.toString();
	}

	record BookDtoSuggestion(String title, String category) {
	}
}
