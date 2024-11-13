package com.RentNow.notification.cron;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class LateBooksNotification extends AbstractCron {

	public LateBooksNotification(RestTemplate restTemplate) {
		super(restTemplate);
	}

	@Scheduled(fixedRateString = "${custom.remindersSchedulerTime}", timeUnit = TimeUnit.MINUTES)
	void sendLateBooksNotification() {
		try {
			ResponseEntity<String> ans = restTemplate.getForEntity(coreUrl + "/cron/sendLateBooksNotificaton", String.class);
			log.info("[LateBooksNotification]: {}", ans.getBody());
		} catch (Exception e) {
			log.error("Could not clean up");
			log.error(e.getMessage());
		}
	}
}
