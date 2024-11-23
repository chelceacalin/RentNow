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
			ResponseEntity<String> ans = restTemplate.getForEntity(coreUrl + "/cron/sendLateBooksNotificaton", String.class);
			log.info("[LateBooksNotification]: {}", ans.getBody());
		} catch (Exception e) {
			log.error("Could not clean up");
			log.error(e.getMessage());
		}
	}

	public void sendNewsLetterNotification(){
		try {
			ResponseEntity<String> ans = restTemplate.getForEntity(coreUrl + "/cron/sendNewsletter", String.class);
			log.info("[NewsLetter]: {}", ans.getBody());
		} catch (Exception e) {
			log.error("Could not clean up");
			log.error(e.getMessage());
		}
	}

	public void makeAvailablePendingBooks(){
		try {
			ResponseEntity<String> ans = restTemplate.getForEntity(coreUrl + "/cron/cleanPendingBooks", String.class);
			log.info("[PendingBooksCleanup]: {}", ans.getBody());
		} catch (Exception e) {
			log.error("Could not clean up");
			log.error(e.getMessage());
		}
	}
}
