package com.example.TechNow.TechNow.controller;

import com.example.TechNow.TechNow.dto.Comment.CommentAddDTO;
import com.example.TechNow.TechNow.dto.Comment.CommentAddResponseDTO;
import com.example.TechNow.TechNow.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
