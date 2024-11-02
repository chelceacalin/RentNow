package com.example.TechNow.TechNow.controller;

import com.example.TechNow.TechNow.model.Link;
import com.example.TechNow.TechNow.service.LinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/links")
@RequiredArgsConstructor
public class LinkController extends BaseController {

	final LinkService linkService;

	@GetMapping
	public ResponseEntity<Object> get() {
		return buildOkResponse(linkService.findAll());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Object> getById(@PathVariable UUID id) {
		return buildOkResponse(linkService.findById(id));
	}

	@PostMapping
	public ResponseEntity<Object> save(@RequestBody Link link) {
		return buildCreatedResponse(linkService.save(link));
	}

	@PutMapping
	public ResponseEntity<Object> update(@RequestBody Link link) {
		return buildOkResponse(linkService.update(link));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Object> delete(@PathVariable UUID id) {
		linkService.deleteLink(id);
		return buildOkResponse();
	}
}
