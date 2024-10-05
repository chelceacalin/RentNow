package com.example.TechNow.TechNow.service;

import io.minio.*;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ImageStorageService {

	final MinioClient minioClient;

	@Value("${minio.url}")
	String minioUrl;

	@Value("${custom.default_buckets}")
	List<String> minioBuckets;

	@PostConstruct
	void initBuckets() {
		minioBuckets.forEach(bucketName -> {
			try {
				var bucket = BucketExistsArgs.builder().bucket(bucketName).build();
				if (!minioClient.bucketExists(bucket)) {
					minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).objectLock(false)
							.build());

					String policy = getPolicy(bucketName);

					minioClient.setBucketPolicy(
							SetBucketPolicyArgs.builder()
									.bucket(bucketName)
									.config(policy)
									.build()
					);
					log.info("[MINIO]: Created bucket: {}", bucketName);
				}
			} catch (Exception e) {
				throw new RuntimeException(e);
			}
		});
	}

	private static @NotNull String getPolicy(String bucketName) {
		return "{\n" +
			   "  \"Version\": \"2012-10-17\",\n" +
			   "  \"Statement\": [\n" +
			   "    {\n" +
			   "      \"Effect\": \"Allow\",\n" +
			   "      \"Principal\": \"*\",\n" +
			   "      \"Action\": [\n" +
			   "        \"s3:GetObject\"\n" +
			   "      ],\n" +
			   "      \"Resource\": [\n" +
			   "        \"arn:aws:s3:::" + bucketName + "/*\"\n" +
			   "      ]\n" +
			   "    }\n" +
			   "  ]\n" +
			   "}";
	}

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
