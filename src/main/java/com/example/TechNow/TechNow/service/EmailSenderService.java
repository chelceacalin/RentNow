package com.example.TechNow.TechNow.service;

import jakarta.annotation.PostConstruct;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailSenderService {
    final JavaMailSender mailSender;

    @Value("${custom.fromEmail}")
    String fromEmail;

    @Value("${custom.enableMailService}")
    Boolean isEnabled;

    @PostConstruct
    void init() {
        if (!isEnabled) {
            log.warn("[MAIL] Running without email service");
        } else {
            log.info("[MAIL] Running with email service");
        }
    }

    public void sendEmail(String to, String subject, String body) {
        if (!isEnabled) {
            log.warn("[MAIL] Mail service not enabled");
            return;
        }
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(mimeMessage);
            log.info("[MAIL] Mail sent successfully");
        } catch (Exception e) {
            log.error("[MAIL] Error sending mail {}", e.getMessage());
        }
    }

}
