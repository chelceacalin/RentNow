package com.example.TechNow.TechNow.controller;

import com.example.TechNow.TechNow.dto.QA.QaSimilarity;
import com.example.TechNow.TechNow.model.QA;
import com.example.TechNow.TechNow.service.QaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/qa")
@RequiredArgsConstructor
public class QaController extends BaseController {

	final QaService qaService;

	@GetMapping
	public ResponseEntity<Object> findAll() {
		return buildOkResponse(qaService.findAll());
	}

	@GetMapping("/random")
	public ResponseEntity<Object> findRandomQAS() {
		return buildOkResponse(qaService.findRandomQAS());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Object> findById(@PathVariable(name = "id") UUID id) {
		return buildOkResponse(qaService.findById(id));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Object> delete(@PathVariable(name = "id") UUID id) {
		qaService.deleteById(id);
		return buildOkResponse();
	}

	@PostMapping
	public ResponseEntity<Object> save(@RequestBody QA qa) {
		return buildOkResponse(qaService.save(qa));
	}

	@PostMapping("/similar")
	public ResponseEntity<Object> findAnswers(@RequestBody QaSimilarity qaSimilarity) {
		return buildOkResponse(qaService.getSimilarQas(qaSimilarity));
	}

	@PutMapping
	public ResponseEntity<Object> update(@RequestBody QA qa) {
		return buildOkResponse(qaService.update(qa));
	}
}
