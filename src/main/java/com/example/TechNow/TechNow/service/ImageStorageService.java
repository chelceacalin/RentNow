package com.example.TechNow.TechNow.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Date;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
public class ImageStorageService {

	final MinioClient minioClient;

	@Value("${minio.url}")
	String minioUrl;

	public String uploadImage(String bucketName, MultipartFile file) {
		String fileName = generateFileName(file);
		try (InputStream is = file.getInputStream()) {
			minioClient.putObject(
					PutObjectArgs.builder()
							.bucket(bucketName)
							.object(fileName).stream(is, file.getSize(), -1)
							.contentType(file.getContentType())
							.build());
			return minioUrl + "/" + bucketName + "/" + fileName;
		} catch (Exception e) {
			throw new RuntimeException("Failed to store image file.", e);
		}
	}
	String generateFileName(MultipartFile file) {
		return new Date().getTime() + "-" + Objects.requireNonNull(file.getOriginalFilename()).replace(" ", "_");
	}

}
