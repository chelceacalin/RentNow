package com.example.TechNow.TechNow.service;

import com.example.TechNow.TechNow.config.BaseUrlRestTemplate;
import com.example.TechNow.TechNow.dto.QA.QaResponse;
import com.example.TechNow.TechNow.dto.QA.QaSimilarity;
import com.example.TechNow.TechNow.model.QA;
import com.example.TechNow.TechNow.repository.QaRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static com.example.TechNow.TechNow.util.Utils.getEntityOrThrow;

@Service
@Slf4j
public class QaService {

	final QaRepository qaRepository;
	final BaseUrlRestTemplate pythonServiceTemplate;
	final ObjectMapper objectMapper;

	public QaService(@Qualifier("pythonServiceTemplate") BaseUrlRestTemplate pythonServiceTemplate, QaRepository qaRepository, ObjectMapper objectMapper) {
		this.pythonServiceTemplate = pythonServiceTemplate;
		this.qaRepository = qaRepository;
		this.objectMapper = objectMapper;
	}

	public List<QA> findAll() {
		return qaRepository.findAllQA();
	}

	public List<QaResponse> findRandomQAS() {
		String response = pythonServiceTemplate.getForObject("/qa/random", String.class);

		try {
			return objectMapper.readValue(response, new TypeReference<>() {
			});
		} catch (JsonProcessingException e) {
			return List.of();
		}
	}

	public QA findById(UUID id) {
		return getEntityOrThrow(() -> qaRepository.findById(id), "No QA Found");
	}

	public QaResponse getSimilarQas(QaSimilarity qaSimilarity) {
		try {
			String response = pythonServiceTemplate
					.postForEntityBody("/qa/similar", qaSimilarity, String.class);
			try {
				QaResponse qaResponse = objectMapper.readValue(response, QaResponse.class);
				log.info("Similar QA response: {}", qaResponse);
				return qaResponse;
			} catch (Exception e) {
				return new QaResponse().setAnswer("No relevant response found for your question")
						.setId(String.valueOf(UUID.randomUUID()))
						.setQuestion("");
			}
		} catch (Exception e) {
			log.error("Exception occurred: {}", e.getMessage());
			return null;
		}
	}

	public QA save(QA qa) {
		qa.setCreated_date(LocalDateTime.now());
		qa.setUpdated_date(LocalDateTime.now());
		QA saved = qaRepository.save(qa);
		try {
			pythonServiceTemplate.postForEntity("/qa", saved, String.class);
		} catch (Exception e) {
			log.error("Error uploading to python service {}", e.getMessage());
		}
		return saved;
	}

	public QA update(QA qa) {
		QA existing = getEntityOrThrow(() -> qaRepository.findById(qa.getId()), "No QA Found");
		existing
				.setAnswer(qa.getAnswer())
				.setQuestion(qa.getQuestion())
				.setUpdated_date(LocalDateTime.now());
		try {
			pythonServiceTemplate.putForEntity("/qa/" + existing.getId(), existing, String.class);
		} catch (Exception e) {
			log.error("Error uploading to python service {}", e.getMessage());
		}
		return qaRepository.save(existing);
	}

	public void deleteById(UUID id) {
		qaRepository.deleteById(id);
		try {
			pythonServiceTemplate.deleteForEntityAsync("/qa/" + id);
		} catch (Exception e) {
			log.error("Error uploading to python service {}", e.getMessage());
		}
	}
}
