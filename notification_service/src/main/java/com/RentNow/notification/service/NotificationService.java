package com.RentNow.notification.service;

import com.RentNow.notification.util.AbstractCron;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class NotificationService extends AbstractCron {
	public NotificationService(RestTemplate restTemplate) {
		super(restTemplate);
	}

	public void sendLateBooksNotification(){
		try {
			log.info("[NotificationService][sendLateBooksNotification] start");
			ResponseEntity<String> ans = restTemplate.getForEntity(coreUrl + "/cron/sendLateBooksNotificaton", String.class);
			log.info("[NotificationService][sendLateBooksNotification] end");
		} catch (Exception e) {
			log.info("[NotificationService][sendLateBooksNotification] Could not clean up {}", e.getMessage());
		}
	}

	public void sendNewsLetterNotification(){
		try {
			log.info("[NotificationService][sendNewsLetterNotification] start");
			ResponseEntity<String> ans = restTemplate.getForEntity(coreUrl + "/cron/sendNewsletter", String.class);
			log.info("[NotificationService][sendNewsLetterNotification] end");
		} catch (Exception e) {
			log.info("[NotificationService][sendNewsLetterNotification] Could not clean up {}", e.getMessage());
		}
	}

	public void makeAvailablePendingBooks(){
		try {
			log.info("[NotificationService][makeAvailablePendingBooks] start");
			ResponseEntity<String> ans = restTemplate.getForEntity(coreUrl + "/cron/cleanPendingBooks", String.class);
			log.info("[NotificationService][makeAvailablePendingBooks] end");
		} catch (Exception e) {
            log.info("[NotificationService][makeAvailablePendingBooks] Could not clean up {}", e.getMessage());
		}
	}
}
