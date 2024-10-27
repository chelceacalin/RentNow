package com.example.TechNow.TechNow.service;

import com.example.TechNow.TechNow.model.QA;
import com.example.TechNow.TechNow.repository.QaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static com.example.TechNow.TechNow.util.Utils.getEntityOrThrow;

@Service
@RequiredArgsConstructor
@Slf4j
public class QaService {

	final QaRepository qaRepository;

	public List<QA> findAll() {
		return qaRepository.findAllQA();
	}

	public QA findById(UUID id) {
		return getEntityOrThrow(() -> qaRepository.findById(id), "No QA Found");
	}

	public QA save(QA qa) {
		qa.setCreated_date(LocalDateTime.now());
		qa.setUpdated_date(LocalDateTime.now());
		return qaRepository.save(qa);
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
