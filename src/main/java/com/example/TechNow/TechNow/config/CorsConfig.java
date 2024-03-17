package com.example.TechNow.TechNow.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

	@Value("${custom.frontend.app-url}")
	private String frontendAppUrl;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
				.allowedOrigins(frontendAppUrl, "http://localhost:4173","http://localhost:3000")
				.allowedHeaders("*")
				.allowedMethods("POST","PUT","GET","DELETE")
				.allowCredentials(true);
	}
}
