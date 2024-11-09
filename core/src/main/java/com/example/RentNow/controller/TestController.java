package  com.example.RentNow.controller;

import  com.example.RentNow.cron.NewsLetterCron;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "custom.enableMailService", havingValue = "true")
public class TestController {

	final NewsLetterCron newsLetter;

	@GetMapping("/newsLetter")
	public void newsLetter() {
		newsLetter.sendNewsletter();
	}
}
