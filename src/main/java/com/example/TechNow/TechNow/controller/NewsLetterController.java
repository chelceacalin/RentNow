package com.example.TechNow.TechNow.controller;

import com.example.TechNow.TechNow.service.NewsletterService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/newsletter")
@RequiredArgsConstructor
public class NewsLetterController {
	final NewsletterService newsletterService;

	@PostMapping("/unsubscribe/{token}")
	public void unsubscribe(@PathVariable String token) {
		newsletterService.unsubscribe(token);
	}
}
