package com.example.TechNow.TechNow.config;

import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class BaseUrlRestTemplate {

	private final RestTemplate restTemplate;
	private final String baseUrl;
	final ExecutorService executorService = Executors.newVirtualThreadPerTaskExecutor();

	public BaseUrlRestTemplate(RestTemplate restTemplate, String baseUrl) {
		this.restTemplate = restTemplate;
		this.baseUrl = baseUrl;
	}

	public <T> T getForObject(String endpoint, Class<T> responseType) {
		return restTemplate.getForObject(baseUrl + endpoint, responseType);
	}

	public <T, R> void postForEntity(String endpoint, R requestBody, Class<T> responseType) {
		CompletableFuture.supplyAsync(() -> {
			HttpEntity<R> requestEntity = new HttpEntity<>(requestBody);
			return restTemplate.postForEntity(baseUrl + endpoint, requestEntity, responseType);
		}, executorService);
	}

	public <T, R> T postForEntityBody(String endpoint, R requestBody, Class<T> responseType) {
		HttpEntity<R> requestEntity = new HttpEntity<>(requestBody);
		ResponseEntity<T> response = restTemplate.postForEntity(baseUrl + endpoint, requestEntity, responseType);
		return response.getBody();
	}

	public <T, R> CompletableFuture<Void> putForEntity(String endpoint, R requestBody, Class<T> responseType) {
		return CompletableFuture.runAsync(() -> {
			HttpEntity<R> requestEntity = new HttpEntity<>(requestBody);
			restTemplate.put(baseUrl + endpoint, requestEntity);
		}, executorService);
	}

	public CompletableFuture<Void> deleteForEntityAsync(String endpoint) {
		return CompletableFuture.runAsync(() -> {
			restTemplate.delete(baseUrl + endpoint);
		}, executorService);
	}
}
