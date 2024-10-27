package com.example.TechNow.TechNow.service;

import com.example.TechNow.TechNow.config.BaseUrlRestTemplate;
import com.example.TechNow.TechNow.dto.QA.QaSimilarity;
import com.example.TechNow.TechNow.model.QA;
import com.example.TechNow.TechNow.repository.QaRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
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

	public QA findById(UUID id) {
		return getEntityOrThrow(() -> qaRepository.findById(id), "No QA Found");
	}

	// Revised getSimilarQas Method
	public List<QA> getSimilarQas(QaSimilarity qaSimilarity) {
		try {
			String response = pythonServiceTemplate
					.postForEntityBody("/qa/similar", qaSimilarity, String.class);

			try {
				List<QA> similars = objectMapper.readValue(response, new TypeReference<>() {
				});
			} catch (Exception e) {
				log.error(e.getMessage());
			}

			System.out.println(response);
			return null;
//			return response != null ? response.getSimilarQAs() : Collections.emptyList();
		} catch (Exception e) {
			System.err.println("Exception occurred: " + e.getMessage());
			return Collections.emptyList();
		}
	}

	@Data
	class SimilarQas {
		List<QaSimilarity> similarQas;
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
