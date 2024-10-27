package com.example.TechNow.TechNow.service;

import com.example.TechNow.TechNow.model.QA;
import com.example.TechNow.TechNow.repository.QaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static com.example.TechNow.TechNow.util.Utils.getEntityOrThrow;

@Service
@RequiredArgsConstructor
@Slf4j
public class QaService {

	final RestTemplate restTemplate;
	final QaRepository qaRepository;

	@Value("${custom.python-url}")
	String pythonUrl;

	public List<QA> findAll() {
		return qaRepository.findAllQA();
	}

	public QA findById(UUID id) {
		return getEntityOrThrow(() -> qaRepository.findById(id), "No QA Found");
	}

	public QA save(QA qa) {
		qa.setCreated_date(LocalDateTime.now());
		qa.setUpdated_date(LocalDateTime.now());
		QA saved = qaRepository.save(qa);
		try {
			restTemplate.postForEntity(pythonUrl + "/qa", saved, String.class);
			log.info("Successfully sent QA to python service");
		} catch (Exception e) {
			log.error("Error uploading to python service{}", e.getMessage());
		}
		return saved;
	}

	public QA update(QA qa) {
		QA existing = getEntityOrThrow(() -> qaRepository.findById(qa.getId()), "No QA Found");
		existing
				.setAnswer(qa.getAnswer())
				.setQuestion(qa.getQuestion())
				.setUpdated_date(LocalDateTime.now());
		return qaRepository.save(existing);
	}

	public void deleteById(UUID qa) {
		qaRepository.deleteById(qa);
	}

}
