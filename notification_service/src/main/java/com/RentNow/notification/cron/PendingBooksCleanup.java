package com.RentNow.notification.cron;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class PendingBooksCleanup extends AbstractCron {

	public PendingBooksCleanup(RestTemplate restTemplate) {
		super(restTemplate);
	}

	@Scheduled(fixedRate = 24, timeUnit = TimeUnit.HOURS)
	public void makeAvailablePendingBooks() {
		try {
			ResponseEntity<String> ans = restTemplate.getForEntity(coreUrl + "/cron/cleanPendingBooks", String.class);
			log.info("[PendingBooksCleanup]: {}", ans.getBody());
		} catch (Exception e) {
			log.error("Could not clean up");
			log.error(e.getMessage());
		}
	}
}
