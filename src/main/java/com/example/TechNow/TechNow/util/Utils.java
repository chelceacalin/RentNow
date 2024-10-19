package com.example.TechNow.TechNow.util;

import com.example.TechNow.TechNow.dto.BookHistory.BookHistoryDTO;
import com.example.TechNow.TechNow.dto.Email.EmailDTO;
import com.example.TechNow.TechNow.model.Book;
import com.example.TechNow.TechNow.model.User;
import jakarta.persistence.EntityNotFoundException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.function.Supplier;

public class Utils {

	public static String parseDate(LocalDateTime date) {
		return date != null ? date.format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")) : null;
	}

	public static String parseDateSimple(LocalDateTime date) {
		return date != null ? date.format(DateTimeFormatter.ofPattern("dd-MM-yyyy")) : null;
	}

	public static <T> T getEntityOrThrow(Supplier<Optional<T>> entitySupplier, String errorMessage) {
		return entitySupplier.get().orElseThrow(() -> new EntityNotFoundException(errorMessage));
	}

	public static  String getRentBookMessage(User user, Book book, String rentedUntil) {
		return String.format(
				"<div style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>" +
						"  <h2 style='color: #4CAF50;'>Congratulations!</h2>" +
						"  <p>Dear %s,</p>" +
						"  <p>You have successfully rented the book titled <strong>%s</strong>until %s</p> " +
						"  <p>We hope you enjoy your reading! If you have any questions, feel free to reach out to our support team.</p>" +
						"  <footer style='margin-top: 20px; border-top: 1px solid #eaeaea; padding-top: 10px;'>" +
						"    <p style='font-size: 0.9em; color: #888;'>Best regards,<br>RentNow Team</p>" +
						"  </footer>" +
						"</div>",
				user.getUsername(), book.getTitle(), rentedUntil
		);
	}

	public static String getRentBookMessageForOwner(BookHistoryDTO bookHistoryDTO, Book book, User user) {
		return String.format(
				"<div style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>" +
						"  <p style='font-size: 0.9em; color: #888;'>[%s]</p>" +
						"  <h2 style='color: #4CAF50;'>Book Rental Notification</h2>" +
						"  <p>Your book <strong>%s</strong> has been rented by <a href='mailto:%s'>%s</a> until <strong>%s</strong>.</p>" +
						"  <p>If you have any questions or need further assistance, please do not hesitate to contact us.</p>" +
						"  <footer style='margin-top: 20px; border-top: 1px solid #eaeaea; padding-top: 10px;'>" +
						"    <p style='font-size: 0.9em; color: #888;'>RentNow Team</p>" +
						"  </footer>" +
						"</div>",
				bookHistoryDTO.getRentedDate(),
				book.getTitle(),
				user.getEmail(),
				user.getEmail(),
				bookHistoryDTO.getRentedUntil()
		);
	}

	public static String getEmailBody(EmailDTO emailDTO) {
		return String.format(
				"<div style='font-family: Arial, sans-serif; color: #333; line-height: 1.6;'>" +
						"  <h2 style='color: #4CAF50;'>Hello %s,</h2>" +
						"  <p>This is to inform you that <strong>%s</strong> has returned the book titled <em>%s</em> owned by you.</p>" +
						"  <p>The book is now available for others to rent. We hope you have a great day!</p>" +
						"  <footer style='margin-top: 20px; border-top: 1px solid #eaeaea; padding-top: 10px;'>" +
						"    <p style='font-size: 0.9em; color: #888;'>TechNow Team</p>" +
						"  </footer>" +
						"</div>",
				emailDTO.getOwnerUsername(), emailDTO.getRenterUsername(), emailDTO.getBookTitle()
		);
	}
}
