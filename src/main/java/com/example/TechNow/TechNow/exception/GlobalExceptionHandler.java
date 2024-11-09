package com.example.TechNow.TechNow.exception;

import com.google.gson.JsonParseException;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler({EntityNotFoundException.class})
	public ResponseEntity<Object> handleNotFoundException(EntityNotFoundException exception) {
		String message = exception.getMessage();
		log.error("EntityNotFoundException: {}", message);
		return ResponseEntity
				.status(HttpStatus.NOT_FOUND)
				.body(exception);
	}


	@ExceptionHandler({RuntimeException.class})
	public ResponseEntity<Object> handleRuntimeException(RuntimeException exception) {
		String message = exception.getMessage();
		log.error("RuntimeException: {}", message);
		return ResponseEntity
				.status(HttpStatus.NOT_FOUND)
				.body(message);
	}

	@ExceptionHandler({JsonParseException.class})
	public ResponseEntity<Object> handleConversionError(JsonParseException exception) {
		String message = exception.getMessage();
		log.error("JsonParseException: {}", message);
		return ResponseEntity
				.status(HttpStatus.PROCESSING)
				.body(message);
	}

	@ExceptionHandler({Exception.class})
	public ResponseEntity<Object> handleGeneralException(Exception exception) {
		String message = exception.getMessage();
		log.error("Exception: {}", message);
		return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(exception);
	}
}
