package  com.example.RentNow.service;

import  com.example.RentNow.model.User;
import  com.example.RentNow.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static  com.example.RentNow.util.EmailConstants.MAIL;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailSenderService {
    final JavaMailSender mailSender;
    final UserRepository userRepository;

    @Value("${custom.fromEmail}")
    String fromEmail;

    @Value("${custom.enableMailService}")
    Boolean isEnabled;

    final ExecutorService executorService = Executors.newVirtualThreadPerTaskExecutor();

    @PostConstruct
    void init() {
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

        Optional<User> userOptional = userRepository.findByEmail(fromEmail);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (!user.isMailNotificationsEnabled()) {
                return;
            }
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

    @PreDestroy
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
