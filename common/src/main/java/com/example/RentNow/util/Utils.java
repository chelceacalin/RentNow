package com.example.RentNow.util;

import com.example.RentNow.dto.BookHistory.BookHistoryDTO;
import com.example.RentNow.dto.Email.EmailDTO;
import com.example.RentNow.model.Book;
import com.example.RentNow.model.User;

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
		return entitySupplier.get().orElseThrow(() -> new RuntimeException(errorMessage));
	}

	public static String getRentBookMessage(User user, Book book, String rentedUntil) {
		return String.format(
				"<div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;'>" +
				"  <h2 style='color: #4CAF50; font-size: 1.5em; margin-bottom: 10px;'>Congratulations!</h2>" +
				"  <p style='font-size: 1.1em; color: #555; line-height: 1.6;'>Dear %s,</p>" +
				"  <p style='font-size: 1em; color: #555; line-height: 1.6;'>You have successfully rented the book titled <strong style='color: #333;'>%s</strong> until <strong>%s</strong>.</p>" +
				"  <p style='font-size: 1em; color: #555; line-height: 1.6;'>We hope you enjoy your reading! If you have any questions, feel free to reach out to our support team.</p>" +
				"  <footer style='margin-top: 30px; padding-top: 15px; border-top: 1px solid #eaeaea; text-align: center; color: #888; font-size: 0.9em;'>" +
				"    <p style='margin: 0;'>Best regards,</p>" +
				"    <p style='margin: 5px 0 0;'>The RentNow Team</p>" +
				"  </footer>" +
				"</div>",
				user.getUsername(), book.getTitle(), rentedUntil
		);
	}

	public static String getRentBookMessageForOwner(BookHistoryDTO bookHistoryDTO, Book book, User user) {
		return String.format(
				"<div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;'>" +
				"  <p style='font-size: 0.8em; color: #999; text-align: right;'>%s</p>" +
				"  <h2 style='color: #4CAF50; font-size: 1.5em; margin-bottom: 10px;'>Book Rental Notification</h2>" +
				"  <p style='font-size: 1.1em; color: #555; line-height: 1.6;'>Hello,</p>" +
				"  <p style='font-size: 1em; color: #555; line-height: 1.6;'>We wanted to let you know that your book <strong style='color: #333;'>%s</strong> has been rented by <a href='mailto:%s' style='color: #4CAF50; text-decoration: none;'>%s</a> until <strong style='color: #333;'>%s</strong>.</p>" +
				"  <p style='font-size: 1em; color: #555; line-height: 1.6;'>If you have any questions or need assistance, please feel free to reach out to us. We’re here to help!</p>" +
				"  <footer style='margin-top: 30px; padding-top: 15px; border-top: 1px solid #eaeaea; text-align: center; color: #888; font-size: 0.9em;'>" +
				"    <p style='margin: 0;'>Best Regards,</p>" +
				"    <p style='margin: 5px 0 0;'>The RentNow Team</p>" +
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
				"<div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;'>" +
				"  <h2 style='color: #4CAF50; font-size: 1.5em; margin-bottom: 10px;'>Hello %s,</h2>" +
				"  <p style='font-size: 1.1em; color: #555; line-height: 1.6;'>We wanted to let you know that <strong style='color: #333;'>%s</strong> has returned the book titled <em style='color: #333;'>%s</em> that you own.</p>" +
				"  <p style='font-size: 1em; color: #555; line-height: 1.6;'>The book is now available for others to rent. Thank you for helping us keep the library active! We hope you have a fantastic day.</p>" +
				"  <footer style='margin-top: 30px; padding-top: 15px; border-top: 1px solid #eaeaea; text-align: center; color: #888; font-size: 0.9em;'>" +
				"    <p style='margin: 0;'>Best Regards,</p>" +
				"    <p style='margin: 5px 0 0;'>The TechNow Team</p>" +
				"  </footer>" +
				"</div>",
				emailDTO.getOwnerUsername(), emailDTO.getRenterUsername(), emailDTO.getBookTitle()
		);

	}

	public static String getRejectEmailBody(EmailDTO emailDTO) {
		String reason = emailDTO.getRejectReason() != null && !emailDTO.getRejectReason().isEmpty()
				? emailDTO.getRejectReason()
				: "No specific reason was provided.";

		return String.format(
				"<div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;'>" +
				"  <h2 style='color: #FF5733; font-size: 1.5em; margin-bottom: 10px;'>Hello %s,</h2>" +
				"  <p style='font-size: 1.1em; color: #555; line-height: 1.6;'>We regret to inform you that your request to rent the book <strong style='color: #333;'>%s</strong> has been <strong>rejected</strong>.</p>" +
				"  <p style='font-size: 1em; color: #555; line-height: 1.6;'>Reason: <em style='color: #333;'>%s</em></p>" +
				"  <p style='font-size: 1em; color: #555; line-height: 1.6;'>The book is now available for others to rent. We apologize for any inconvenience and appreciate your understanding.</p>" +
				"  <footer style='margin-top: 30px; padding-top: 15px; border-top: 1px solid #eaeaea; text-align: center; color: #888; font-size: 0.9em;'>" +
				"    <p style='margin: 0;'>Best regards,</p>" +
				"    <p style='margin: 5px 0 0;'>The TechNow Team</p>" +
				"  </footer>" +
				"</div>",
				emailDTO.getRenterUsername(), emailDTO.getBookTitle(), reason
		);
	}
}
