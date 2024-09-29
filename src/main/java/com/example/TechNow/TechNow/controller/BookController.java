package com.example.TechNow.TechNow.controller;

import com.example.TechNow.TechNow.dto.Book.*;
import com.example.TechNow.TechNow.dto.BookHistory.BookHistoryDTO;
import com.example.TechNow.TechNow.service.BookService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@Slf4j
public class BookController {

	final BookService bookService;

	@GetMapping
	public Page<BookDTO> findUserBooks(@ModelAttribute BookFilterDTO dto,
									   @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
									   @RequestParam(name = "pageSize", defaultValue = "1000") int pageSize) {
		log.info("Books searched with {}", dto);
		return bookService.findUserBooks(dto, pageNo, pageSize);
	}


	@PostMapping
	public BookAddDTO addBook(@RequestPart("bookDTO") BookAddDTO bookDTO, @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
		return bookService.addBook(bookDTO, imageFile);
	}


	@PostMapping("/{id}")
	public void updateBook(@PathVariable UUID id, @RequestPart("bookDTO") BookAddDTO bookAddDTO, @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
		bookService.updateBook(id, bookAddDTO, imageFile);
	}

	@PostMapping("/delete/{id}")
	public ResponseEntity<String> deleteBook(@PathVariable UUID id) {
		bookService.deleteBookIfNotRented(id);
		return ResponseEntity.ok("Book can be deleted");
	}


	@GetMapping("/{id}")
	public BookAddDTO findBookById(@PathVariable UUID id) {
		return bookService.findBookByID(id);
	}

	@GetMapping("/rent/{id}")
	public BookRentDTO findBookToRent(@PathVariable UUID id) {
		return bookService.findBookToRent(id);
	}


	@PostMapping("/history")
	public ResponseEntity<Object> addBookHistory(@Valid @RequestBody BookHistoryDTO bookHistoryDTO, BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			return new ResponseEntity<>(bindingResult.getAllErrors().getFirst().getDefaultMessage(), HttpStatus.BAD_REQUEST);
		}
		Optional<String> errorOptional = bookService.validateBookHistory(bookHistoryDTO);

		if (errorOptional.isEmpty()) {
			bookService.addBookHistory(bookHistoryDTO);
			return new ResponseEntity<>(bookHistoryDTO, HttpStatus.CREATED);
		} else {
			return new ResponseEntity<>(errorOptional.get(), HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping("/rented")
	public Page<BookDTO> findRentedBooksForUser(
			@ModelAttribute MyRentedBooksRequestDTO myRentedBooksRequestDTO,
			@RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
			@RequestParam(name = "pageSize", defaultValue = "15") int pageSize

	) {
		return bookService.findRentedBooksForUser(myRentedBooksRequestDTO, pageNo, pageSize);
	}

	@PostMapping("/updateStatus/{id}")
	public void changeRentedBookStatus(@PathVariable UUID id) {
		bookService.changeRentedBookStatus(id);
	}

}
