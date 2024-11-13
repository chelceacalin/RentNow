package com.example.RentNow.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class BaseController {

	protected ResponseEntity<Object> buildOkResponse() {
		return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
	}

	protected ResponseEntity<Object> buildOkResponse(Object data) {
		return new ResponseEntity<>(data, HttpStatus.OK);
	}

	protected ResponseEntity<Object> buildOkResponse(Object data, HttpHeaders headers) {
		return ResponseEntity.ok().headers(headers).body(data);
	}

	protected ResponseEntity<Object> buildCreatedResponse(Object data) {
		return new ResponseEntity<>(data, HttpStatus.CREATED);
	}
}
