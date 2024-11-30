package com.example.RentNow.controller;

import com.example.RentNow.dto.Settings.SettingsAddDto;
import com.example.RentNow.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/settings")
@RestController
@RequiredArgsConstructor
public class SettingsController extends BaseController {

	final SettingsService settingsService;

	@GetMapping("/user/{email}")
	public ResponseEntity<Object> get(@PathVariable String email) {
		return buildOkResponse(settingsService.findByUserEmail(email));
	}

	@PostMapping("/user/{email}")
	public ResponseEntity<Object> save(@PathVariable String email, @RequestBody SettingsAddDto settingsAddDto) {
		return buildOkResponse(settingsService.saveByUserEmail(email, settingsAddDto));
	}

	@PutMapping("/user/{email}")
	public ResponseEntity<Object> update(@PathVariable String email, @RequestBody SettingsAddDto settingsAddDto) {
		return buildOkResponse(settingsService.saveByUserEmail(email, settingsAddDto));
	}
}
