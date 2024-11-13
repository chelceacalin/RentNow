package  com.example.RentNow.exception;

import com.google.gson.JsonParseException;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

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
	public ResponseEntity<Object> handleRuntimeException(RuntimeException ex) {
		Map<String, Object> errorDetails = new HashMap<>();
		errorDetails.put("error", ex.getMessage());
		errorDetails.put("timestamp", System.currentTimeMillis());
		String message = ex.getMessage();
		log.error("RuntimeException: {}", message);
		return ResponseEntity
				.status(HttpStatus.NOT_FOUND)
				.body(errorDetails);
	}

	@ExceptionHandler({JsonParseException.class})
	public ResponseEntity<Object> handleConversionError(JsonParseException ex) {
		Map<String, Object> errorDetails = new HashMap<>();
		errorDetails.put("error", ex.getMessage());
		errorDetails.put("timestamp", System.currentTimeMillis());
		log.error("JsonParseException: {}", ex.getMessage());
		return ResponseEntity
				.status(HttpStatus.PROCESSING)
				.body(errorDetails);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Object> handleGeneralException(Exception ex) {
		Map<String, Object> errorDetails = new HashMap<>();
		errorDetails.put("error", ex.getMessage());
		errorDetails.put("timestamp", System.currentTimeMillis());

		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorDetails);
	}
}
