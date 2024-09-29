package com.example.TechNow.TechNow.service;


import com.example.TechNow.TechNow.dto.Book.*;
import com.example.TechNow.TechNow.dto.BookHistory.BookHistoryDTO;
import com.example.TechNow.TechNow.dto.User.UserDTO;
import com.example.TechNow.TechNow.mapper.BookMapper;
import com.example.TechNow.TechNow.model.Book;
import com.example.TechNow.TechNow.model.BookHistory;
import com.example.TechNow.TechNow.model.Category;
import com.example.TechNow.TechNow.model.User;
import com.example.TechNow.TechNow.repository.BookHistoryRepository;
import com.example.TechNow.TechNow.repository.BookRepository;
import com.example.TechNow.TechNow.repository.CategoryRepository;
import com.example.TechNow.TechNow.repository.UserRepository;
import com.example.TechNow.TechNow.specification.BookSpecification;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.example.TechNow.TechNow.mapper.BookHistoryMapper.toBookHistory;
import static com.example.TechNow.TechNow.specification.GenericSpecification.fieldNameLike;
import static com.example.TechNow.TechNow.specification.GenericSpecification.isAvailable;
import static com.example.TechNow.TechNow.specification.BookSpecification.hasCategory;
import static com.example.TechNow.TechNow.specification.BookSpecification.hasUsername;
import static com.example.TechNow.TechNow.util.BookConstants.*;
import static java.util.Objects.nonNull;

@Service
@Transactional
@RequiredArgsConstructor
public class BookService {

	final UserService userService;
	final UserRepository userRepository;
	final BookRepository bookRepository;
	final CategoryRepository categoryRepository;
	final ImageStorageService imageStorageService;
	final BookHistoryRepository bookHistoryRepository;

	public Page<BookDTO> findUserBooks(BookFilterDTO bookFilter, int pageNo, int pageSize) {
		Specification<Book> specification = getSpecification(bookFilter);
		Sort.Direction sortDirection = Sort.Direction.fromString(bookFilter.getDirection());
		Pageable pageable = getPageable(pageNo, pageSize, bookFilter.getSortField(), sortDirection);

		Page<Book> booksPage = bookRepository.findAll(pageable, specification);
		List<BookDTO> books = booksPage.getContent().stream()
				.map(book -> {
					BookHistory history = bookHistoryRepository.findBookHistoryByRentedUntilMostRecent(book.getId());
					return BookMapper.toDto(book, history);
				})
				.toList();

		return new PageImpl<>(books, pageable, booksPage.getTotalElements());
	}

	static Pageable getPageable(int pageNo, int pageSize, String sortField, Sort.Direction sortDirection) {
		return switch (sortField) {
			case RENTED_BY -> PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, USERNAME));
			case RENTED_UNTIL -> PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, BOOK_HISTORIES_RENTED_UNTIL));
			case RENTED_DATE -> PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, BOOK_HISTORIES_RENTED_DATE));
			default -> PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, sortField));
		};
	}

	Specification<Book> getSpecification(BookFilterDTO bookFilter) {
		Specification<Book> specification = Specification.where(null);

		if (nonNull(bookFilter.getOwner_username())) {
			specification = specification.and(hasUsername(bookFilter.getOwner_username()));
		}

		if (nonNull(bookFilter.getTitle())) {
			specification = specification.and(fieldNameLike(bookFilter.getTitle(), TITLE));
		}

		if (nonNull(bookFilter.getDirector())) {
			specification = specification.and(fieldNameLike(bookFilter.getDirector(), DIRECTOR));
		}

		if (nonNull(bookFilter.getCategory())) {
			specification = specification.and(hasCategory(bookFilter.getCategory()));
		}

		if (nonNull(bookFilter.getIsAvailable())) {
			specification = specification.and(isAvailable(bookFilter.getIsAvailable()));
		}

		if (nonNull(bookFilter.getRentedBy())) {
			specification = specification.and(BookSpecification.getRentedBy(bookFilter.getRentedBy()));
		}

		if (nonNull(bookFilter.getRentedDate())) {
			specification = specification.and(BookSpecification.rentedDateFieldEquals(bookFilter.getRentedDate(), RENTED_DATE));
		}

		if (nonNull(bookFilter.getRentedUntil())) {
			specification = specification.and(BookSpecification.rentedDateFieldEquals(bookFilter.getRentedUntil(), RENTED_UNTIL));
		}

		if (nonNull(bookFilter.getCreated_date())) {
			specification = specification.and(BookSpecification.createdDateEquals(bookFilter.getCreated_date(), CREATED_DATE));
		}
		return specification;
	}

	public BookAddDTO findBookByID(UUID id) {
		Optional<Book> bookOptional = bookRepository.findById(id);
		if (bookOptional.isPresent()) {
			Book book = bookOptional.get();
			return BookMapper.toBookAddDto(book);
		} else {
			throw new RuntimeException("Book with id " + id + " not found");
		}
	}

	public void updateBook(UUID id, BookAddDTO bookDTO, MultipartFile imageFile) {
		Optional<Book> optionalBook = bookRepository.findById(id);
		if (optionalBook.isPresent()) {
			Book foundBook = optionalBook.get();
			Optional<Category> categoryOptional = categoryRepository.findByNameIgnoreCase(bookDTO.getCategory());
			if (categoryOptional.isPresent()) {
				foundBook.setCategory(
								categoryOptional.get())
						.setTitle(bookDTO.getTitle())
						.setDirector(bookDTO.getDirector())
						.setDescription(bookDTO.getDescription());
					if (imageFile != null) {
					String imageUrl = imageStorageService.uploadImage("photos", imageFile);
						foundBook.setPhotoUrl(imageUrl);
				}
				bookRepository.save(foundBook);
			} else {
				throw new RuntimeException("Category not found");
			}
		} else {
			throw new RuntimeException("Book Not Found");
		}
	}

	public void deleteBookIfNotRented(UUID id) {
		Book bookFound = bookRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Book to be deleted does not exist"));
		if (!bookFound.isAvailable()) {
			String userName = getRentedBy(id);
			throw new RuntimeException("Book is being watched by: " + userName
					+ ". You will be able to delete it after it's been returned");
		}
		bookHistoryRepository.deleteBookHistoryByBookId(id);
		bookRepository.deleteById(id);
	}

	public String getRentedBy(UUID id) {
		BookHistory bookHistory = bookHistoryRepository.findBookHistoryByRentedUntilMostRecent(id);
		return bookHistory.getRentedBy().getEmail();
	}

	public BookRentDTO findBookToRent(UUID id) {
		return bookRepository.findById(id)
				.map(BookMapper::toBookRentDto)
				.orElseThrow(() -> new RuntimeException("Book not found"));
	}

	public BookAddDTO addBook(BookAddDTO bookAddDto, MultipartFile imageFile) {
		UserDTO user = userService.findByEmail(bookAddDto.getOwner_email());
		if (nonNull(user)) {
			Optional<Category> categoryOptional = categoryRepository.findByNameIgnoreCase(bookAddDto.getCategory());
			if (categoryOptional.isPresent()) {
				Category category = categoryOptional.get();
				String imageUrl = imageStorageService.uploadImage("photos", imageFile);
				Book createdBook = BookMapper.toBook(bookAddDto, user, category);
				createdBook.setCreated_date(LocalDateTime.now());
				createdBook.setUpdated_date(LocalDateTime.now());
				createdBook.setPhotoUrl(imageUrl);
				bookRepository.save(createdBook);
				return BookMapper.toBookAddDto(createdBook);
			} else {
				throw new RuntimeException("Category not found");
			}
		} else {
			throw new RuntimeException("User not found");
		}
	}

	public void addBookHistory(BookHistoryDTO bookHistoryDTO) {
		Optional<Book> bookOptional = bookRepository.findById(bookHistoryDTO.getBookId());
		bookOptional.ifPresent(book -> {
			book.setAvailable(false);
			bookRepository.save(book);
		});
		BookHistory bookHistory = toBookHistory(bookHistoryDTO);
		bookHistoryRepository.save(bookHistory);
	}

	public Optional<String> validateBookHistory(BookHistoryDTO bookHistoryDTO) {
		Optional<Book> bookOptional = bookRepository.findById(bookHistoryDTO.getBookId());
		if (bookOptional.isEmpty()) {
			return Optional.of("Book not found");
		}
		if (!bookOptional.get().isAvailable()) {
			return Optional.of("Book is not available, was rented by another user");
		}


		Optional<User> user = userRepository.findById(String.valueOf(bookHistoryDTO.getUserId()));
		if (user.isEmpty()) {
			return Optional.of("User not found");
		}
		return Optional.empty();
	}

	public Page<BookDTO> findRentedBooksForUser(MyRentedBooksRequestDTO myRentedBooksDTO, int pageNo, int pageSize) {
		UserDTO user = userService.findByEmail(myRentedBooksDTO.getRentEmail());
		Pageable pageable = myRentedBooksDTO.getPageableRented(pageNo, pageSize);

		Page<BookHistory> bookHistories = bookHistoryRepository.findAllByRentedBy_Id(user.getId(), pageable);
		List<BookDTO> rentedBooks = bookHistories.getContent().stream()
				.map(history -> BookMapper.toDto(history.getBook(), history))
				.toList();
		return new PageImpl<>(rentedBooks, pageable, bookHistories.getTotalElements());
	}

	public void changeRentedBookStatus(UUID id) {
		Optional<Book> bookOptional = bookRepository.findById(id);
		if (bookOptional.isPresent()) {
			Book book = bookOptional.get();
			book.setAvailable(true);
			bookRepository.save(book);
		} else {
			throw new RuntimeException("Book is not found");
		}
	}
}
