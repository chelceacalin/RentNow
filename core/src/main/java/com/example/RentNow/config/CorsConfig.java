package com.example.RentNow.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {


	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
				.allowedOrigins("http://localhost:8079","http://localhost:4173")
				.allowedHeaders("*")
				.allowedMethods("POST", "PUT", "GET", "DELETE","OPTIONS")
				.allowCredentials(true);
	}
}
