package com.example.RentNow.config.minio;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {
	@Value("${minio.access.key}")
	String accessKey;

	@Value("${minio.secret.key}")
	String secretKey;

	@Value("${minio.url}")
	String minioUrl;

	@Bean
	MinioClient minioClient() {
		return MinioClient.builder()
				.endpoint(minioUrl)
				.credentials(accessKey, secretKey)
				.build();
	}

}
