package com.example.RentNow.configuration;


import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public abstract class AbstractRestTemplate {

	public final RestTemplate restTemplate;

	@Value("${custom.core-url:http://localhost:8080}")
	public String coreUrl;

	public AbstractRestTemplate(@Qualifier(value = "coreMicroservice") RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
	}
}
