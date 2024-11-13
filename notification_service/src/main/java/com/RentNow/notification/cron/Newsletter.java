package com.RentNow.notification.cron;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.TimeUnit;

@Component
@Slf4j
public class Newsletter extends AbstractCron {
	public Newsletter(RestTemplate restTemplate) {
		super(restTemplate);
	}

	@Scheduled(fixedRate = 10000, timeUnit = TimeUnit.SECONDS)
	void sendNewsletter() {
		try {
			ResponseEntity<String> ans = restTemplate.getForEntity(coreUrl + "/cron/sendNewsletter", String.class);
			log.info("[NewsLetter]: {}", ans.getBody());
		} catch (Exception e) {
			log.error("Could not clean up");
			log.error(e.getMessage());
		}
	}
}
