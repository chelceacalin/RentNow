package  com.example.RentNow.controller;

import com.example.RentNow.service.BookHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/bookHistory")
public class BookHistoryController extends BaseController {


	final BookHistoryService bookHistoryService;

	@GetMapping("/count/{email}")
	public ResponseEntity<Object> getBookHistoryCountByUserEmail(@PathVariable String email) {
		return buildOkResponse(bookHistoryService.countByUserEmailAndStatus(email));
	}

	@GetMapping
	public ResponseEntity<Object> findAll() {
		return buildOkResponse(bookHistoryService.findAll());
	}
}
