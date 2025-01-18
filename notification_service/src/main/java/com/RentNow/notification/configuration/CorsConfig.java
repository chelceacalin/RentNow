package com.RentNow.notification.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

	@Value("${custom.coreUrl:http://core:8080}")
	String coreUrl;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
				.allowedOrigins(coreUrl, "http://localhost:4173", "http://localhost:3000","http://localhost:8079")
				.allowedHeaders("*")
				.allowedMethods("POST", "PUT", "GET", "DELETE")
				.allowCredentials(true);
	}
}
