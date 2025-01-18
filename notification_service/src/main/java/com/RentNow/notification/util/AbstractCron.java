package com.RentNow.notification.util;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public abstract class AbstractCron {

	public final RestTemplate restTemplate;
	@Value("${custom.core-url:http://core:8080}")
	public String coreUrl;

	public AbstractCron(@Qualifier(value = "coreMicroservice") RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
	}
}
