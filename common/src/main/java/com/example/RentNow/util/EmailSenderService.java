package com.example.RentNow.util;

import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static com.example.RentNow.constants.EmailConstants.MAIL;

@Slf4j
public class EmailSenderService {

	 final JavaMailSender mailSender;
	 final String fromEmail;
	 final Boolean isEnabled;
	 final ExecutorService executorService;

	public EmailSenderService(JavaMailSender mailSender, String fromEmail, Boolean isEnabled) {
		this.mailSender = mailSender;
		this.fromEmail = fromEmail;
		this.isEnabled = isEnabled;
		this.executorService = Executors.newVirtualThreadPerTaskExecutor();
		init();
	}

	private void init() {
		if (!isEnabled) {
			log.warn(MAIL + "Running without email service");
		} else {
			log.info(MAIL + "Running with email service");
		}
	}

	public void sendEmail(String to, String subject, String body, byte[] pdfData) {
		if (!isEnabled) {
			log.warn(MAIL + "Mail service not enabled");
			return;
		}

		executorService.submit(() -> {
			try {
				MimeMessage mimeMessage = mailSender.createMimeMessage();
				MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
				helper.setFrom(fromEmail);
				helper.setTo(to);
				helper.setSubject(subject);
				helper.setText(body, true);
				if (pdfData != null) {
					helper.addAttachment("report.pdf", new ByteArrayResource(pdfData));
				}
				mailSender.send(mimeMessage);
				log.info(MAIL + "Mail sent successfully");
			} catch (Exception e) {
				log.error(MAIL + "Error sending mail {}", e.getMessage());
			}
		});
	}

	public void shutdownExecutor() {
		log.info(MAIL + "Shutting down the email executor service");
		executorService.shutdown();
		try {
			if (!executorService.awaitTermination(5, TimeUnit.SECONDS)) {
				executorService.shutdownNow();
			}
		} catch (InterruptedException e) {
			log.error(MAIL + "Error while shutting down executor service", e);
			executorService.shutdownNow();
			Thread.currentThread().interrupt();
		}
	}
}