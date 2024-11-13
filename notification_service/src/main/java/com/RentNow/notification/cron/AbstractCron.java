package com.RentNow.notification.cron;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public abstract class AbstractCron {

	final RestTemplate restTemplate;
	@Value("${custom.core-url:http://localhost:8081}")
	String coreUrl;

	public AbstractCron(@Qualifier(value = "coreMicroservice") RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
	}
}
