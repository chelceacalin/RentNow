package com.example.TechNow.TechNow.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@org.springframework.context.annotation.Configuration
public class Configuration {

	@Value("${custom.python-url}")
	String pythonUrl;

	@Bean
	public ObjectMapper objectMapper() {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
		return objectMapper;
	}

	@Bean(name = "pythonRestTemplate")
	public RestTemplate pythonRestTemplate() {
		return new RestTemplate();
	}

	@Bean(name = "pythonServiceTemplate")
	public BaseUrlRestTemplate pythonServiceTemplate(@Qualifier("pythonRestTemplate") RestTemplate restTemplate) {
		return new BaseUrlRestTemplate(restTemplate, pythonUrl);
	}
}
