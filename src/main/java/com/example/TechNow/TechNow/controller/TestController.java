package com.example.TechNow.TechNow.controller;

import com.example.TechNow.TechNow.cron.NewsLetterCron;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
@Slf4j
public class TestController {

	final NewsLetterCron newsLetter;

	@GetMapping("/newsLetter")
	public void newsLetter() {
		newsLetter.sendNewsletter();
	}
}
