package  com.example.RentNow.cron;

import  com.example.RentNow.model.Book;
import  com.example.RentNow.model.BookHistory;
import  com.example.RentNow.model.User;
import  com.example.RentNow.service.BookHistoryService;
import  com.example.RentNow.service.EmailSenderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static  com.example.RentNow.util.EmailConstants.MAIL;
import static  com.example.RentNow.util.EmailConstants.RENTNOW;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationService {

    final EmailSenderService emailSenderService;
    final BookHistoryService bookHistoryService;

    @Scheduled(fixedRateString = "${custom.remindersSchedulerTime}", timeUnit = TimeUnit.MINUTES)
    public void sendNotification() {
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
}