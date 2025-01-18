package com.RentNow.notification.configuration;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@org.springframework.context.annotation.Configuration
public class Configuration {
	@Bean(name = "coreMicroservice")
	public RestTemplate coreRestTemplate(RestTemplateBuilder builder) {
		return builder.rootUri("http://core:8080/").build();
	}
}
