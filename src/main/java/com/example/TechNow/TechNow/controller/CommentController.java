package com.example.TechNow.TechNow.controller;

import com.example.TechNow.TechNow.dto.Comment.CommentAddDTO;
import com.example.TechNow.TechNow.dto.Comment.CommentAddResponseDTO;
import com.example.TechNow.TechNow.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/comments")
public class CommentController {


	final CommentService commentService;

	@PostMapping
	public ResponseEntity<CommentAddResponseDTO> addComment(@RequestBody CommentAddDTO commentAddDTO) {
		return ResponseEntity.ok(commentService.addComment(commentAddDTO));
	}

	@DeleteMapping("/{id}")
	public String deleteById(@PathVariable(name = "id") UUID id) {
		return commentService.deleteById(id);
	}
}
