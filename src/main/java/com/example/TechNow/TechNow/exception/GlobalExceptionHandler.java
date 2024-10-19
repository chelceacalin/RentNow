package com.example.TechNow.TechNow.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler({EntityNotFoundException.class})
	public ResponseEntity<Object> handleNotFoundException(EntityNotFoundException exception) {
		return ResponseEntity
				.status(HttpStatus.NOT_FOUND)
				.body(exception.getMessage());
	}


	@ExceptionHandler({RuntimeException.class})
	public ResponseEntity<Object> handleRuntimeException(RuntimeException exception) {
		return ResponseEntity
				.status(HttpStatus.BAD_REQUEST)
				.body(exception.getMessage());
	}

	@ExceptionHandler({Exception.class})
	public ResponseEntity<Object> handleGeneralException(Exception exception) {
		return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(exception.getMessage());
	}
}
