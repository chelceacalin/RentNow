package com.example.RentNow.controller;

import com.example.RentNow.dto.Book.*;
import com.example.RentNow.dto.BookHistory.BookHistoryDTO;
import com.example.RentNow.dto.Email.EmailDTO;
import com.example.RentNow.service.BookService;
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
public class BookController extends BaseController {

    final BookService bookService;

    @GetMapping
    public Page<BookDTO> findUserBooks(@ModelAttribute BookFilterDTO dto,
                                       @RequestParam(defaultValue = "0") int pageNo,
                                       @RequestParam(defaultValue = "1000") int pageSize) {
        try {
            log.info("Books searched with {}", dto);
            return bookService.findUserBooks(dto, pageNo, pageSize);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }


    @GetMapping("/extended")
    public Page<BookReviewDTO> findUserBooksExtended(@ModelAttribute BookFilterDTO dto,
                                       @RequestParam(defaultValue = "0") int pageNo,
                                       @RequestParam(defaultValue = "1000") int pageSize) {
        try {
            log.info("Books with reviews searched with {}", dto);
            return bookService.findUserBooksExt(dto, pageNo, pageSize);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
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
    public ResponseEntity<Object> deleteBook(@PathVariable UUID id) {
        bookService.deleteBookIfNotRented(id);
        return buildOkResponse("Book can be deleted");
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
            return buildCreatedResponse(bookHistoryDTO);
        } else {
            throw new RuntimeException(errorOptional.get());
        }
    }

    @GetMapping("/rented")
    public Page<BookDTO> findRentedBooksForUser(
            @ModelAttribute MyRentedBooksRequestDTO myRentedBooksRequestDTO,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "15") int pageSize

    ) {
        return bookService.findRentedBooksForUser(myRentedBooksRequestDTO, pageNo, pageSize);
    }

    @PostMapping("/updateStatus/{id}")
    public void changeRentedBookStatus(@PathVariable UUID id, @RequestBody EmailDTO emailDTO) {
        bookService.changeRentedBookStatus(id, emailDTO);
    }

    @PutMapping("/updateStatus/{id}")
    public void updateBookStatus(@PathVariable UUID id, @RequestBody EmailDTO emailDTO) {
        bookService.updateBookStatus(id, emailDTO);
    }


    //PDF
    @GetMapping("/users/{email}/books")
    public ResponseEntity<Object> findBooksForUserEmail(
            @PathVariable String email,
            @RequestParam(required = false) String month) {
        if (month != null) {
            return buildOkResponse(bookService.findBooksForUserEmailAndMonth(email, month));
        } else {
            return buildOkResponse(bookService.findBooksForUserEmail(email));
        }
    }

    @GetMapping("/users/{email}/book-history")
    public ResponseEntity<Object> findBooksHistoriesForUserEmail(
            @PathVariable String email,
            @RequestParam(required = false) String month) {
        if (month != null) {
            return buildOkResponse(bookService.findBooksHistoriesForUserEmailAndMonth(email, month));
        } else {
            return buildOkResponse(bookService.findBooksHistoriesForUserEmail(email));
        }
    }
}
