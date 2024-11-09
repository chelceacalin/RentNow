package com.example.TechNow.TechNow.service;

import com.example.TechNow.TechNow.dto.Book.BookDTO;
import com.example.TechNow.TechNow.dto.User.UserDTO;
import com.example.TechNow.TechNow.util.reportService.CustomParagraph;
import com.example.TechNow.TechNow.util.reportService.PageNumberEventHandler;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.property.TextAlignment;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.example.TechNow.TechNow.util.Utils.parseDate;

@Service
@RequiredArgsConstructor
public class ReportService {

	final BookService bookService;
	final UserService userService;
	final DeviceRgb GREEN = new DeviceRgb(0, 255, 0);
	final DeviceRgb ORANGE = new DeviceRgb(255, 165, 0);
	final DeviceRgb RED = new DeviceRgb(255, 0, 0);

	final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

	private static @NotNull Table generateTableHeaders(Boolean isAvailable) {
		float[] columnWidths = isAvailable ? new float[]{50F, 50F, 50F, 50F, 50F} : new float[]{50F, 50F, 50F, 50F, 50F, 50F, 40F, 50F};
		Table table = new Table(columnWidths);

		List<String> tableHeaders = isAvailable
				? List.of("Title", "Director", "Category", "Description", "Owner Email")
				: List.of("Title", "Director", "Category", "Description", "Rented Date", "Rented Until", "Overdue", "Owner Email");

		for (String header : tableHeaders) {
			Cell headerCell = new Cell().add(new Paragraph(header).setBold().setFontSize(8));
			headerCell.setPadding(2);
			headerCell.setBackgroundColor(new DeviceRgb(240, 240, 240));
			headerCell.setTextAlignment(TextAlignment.CENTER);
			table.addHeaderCell(headerCell);
		}
		return table;
	}

	public byte[] generateTable(String email, String month, boolean isAdmin) {
		UserDTO user = userService.findByEmail(email);
		List<BookDTO> books;
		if (isAdmin) {
			if (month != null) {
				books = bookService.findBooksForUserEmailAndMonth(email, month);
			} else {
				books = bookService.findBooksForUserEmail(email);
			}
		} else {
			if (month != null) {
				books = bookService.findBooksHistoriesForUserEmailAndMonth(email, month);
			} else {
				books = bookService.findBooksHistoriesForUserEmail(email);
			}
		}


		if (books.isEmpty()) {
			return null;
		}

		ByteArrayOutputStream out = new ByteArrayOutputStream();
		try {
			PdfWriter writer = new PdfWriter(out);
			PdfDocument pdfDocument = new PdfDocument(writer);
			pdfDocument.addEventHandler(PdfDocumentEvent.END_PAGE, new PageNumberEventHandler(pdfDocument));

			Document document = new Document(pdfDocument, PageSize.A4.rotate());
			document.setMargins(20, 20, 20, 20);
			generatePdfHeader(document, user);
			addTablesByMonth(books, document);
			document.close();
			return out.toByteArray();
		} catch (Exception e) {
			throw new RuntimeException("Error generating PDF: " + e.getMessage());
		}
	}


	private static void generatePdfHeader(Document document, UserDTO user) {
		document.add(new Paragraph("Generation Time: " + parseDate(LocalDateTime.now())));
		document.add(new Paragraph("Hi, " + user.getUsername()).setBold().setFontSize(12));
		document.add(new Paragraph("Here is your book report: ").setFontSize(10));
		document.add(new Paragraph(" "));
	}
	private void addTablesByMonth(List<BookDTO> books, Document document) {
		addAvailableBooks(books, document);
		Map<String, List<BookDTO>> booksGroupedByMonth = books.stream()
				.filter(book -> book.getRentedDate() != null)
				.collect(Collectors.groupingBy(book -> LocalDate.parse(book.getRentedDate(), formatter).format(DateTimeFormatter.ofPattern("yyyy-MM"))));

		addUnavailableBooksGroupedByMonth(document, booksGroupedByMonth);
	}

	private void addUnavailableBooksGroupedByMonth(Document document, Map<String, List<BookDTO>> booksGroupedByMonth) {
		for (Map.Entry<String, List<BookDTO>> entry : booksGroupedByMonth.entrySet()) {
			String month = entry.getKey();
			List<BookDTO> booksForMonth = entry.getValue();

			document.add(new Paragraph("Books rented in " + month).setBold().setFontSize(12));
			document.add(new Paragraph(" "));

			Table table = generateTableHeaders(false);
			for (BookDTO book : booksForMonth) {
				addCommonFields(table, book);
				table.addCell(new Cell().add(new Paragraph(book.getRentedDate())).setPadding(2));
				table.addCell(new Cell().add(new Paragraph(book.getRentedUntil() != null ? book.getRentedUntil() : "N/A")).setPadding(2));
				addOverdueCell(book, table);
				table.addCell(new Cell().add(new Paragraph(book.getOwner_email())).setPadding(2));
			}

			document.add(table);
			document.add(new Paragraph(" "));
		}
	}

	private void addAvailableBooks(List<BookDTO> books, Document document) {
		List<BookDTO> availableBooks = books.stream()
				.filter(book -> book.getRentedDate() == null)
				.toList();

		if (!availableBooks.isEmpty()) {
			document.add(new Paragraph("Available Books").setBold().setFontSize(10));
			document.add(new Paragraph(" "));

			Table table = generateTableHeaders(true);
			for (BookDTO book : availableBooks) {
				addCommonFields(table, book);
				table.addCell(new Cell().add(new Paragraph(book.getOwner_email())));
			}
			document.add(table);
			document.add(new Paragraph(" "));
		}
	}

	private void addCommonFields(Table table, BookDTO book) {
		Float width = 80F;
		TextAlignment textAlignment = TextAlignment.LEFT;
		table.addCell(new Cell().add(new CustomParagraph(book.getTitle(), width, textAlignment)));
		table.addCell(new Cell().add(new CustomParagraph(book.getDirector(), width, textAlignment)));
		table.addCell(new Cell().add(new CustomParagraph(book.getCategory(), width, textAlignment)));
		table.addCell(new Cell().add(new CustomParagraph(book.getDescription(), width, textAlignment)));
	}

	private void addOverdueCell(BookDTO book, Table table) {
		LocalDate rentedUntil = book.getRentedUntil() != null ? LocalDate.parse(book.getRentedUntil(), formatter) : null;
		LocalDate now = LocalDate.now();
		Cell overdueCell = new Cell().setPadding(2);

		if (rentedUntil == null) {
			overdueCell.add(new Paragraph("N/A")).setBackgroundColor(GREEN);
		} else if (rentedUntil.isEqual(now)) {
			overdueCell.add(new Paragraph("ALMOST")).setBackgroundColor(ORANGE);
		} else if (rentedUntil.isBefore(now)) {
			overdueCell.add(new Paragraph("YES")).setBackgroundColor(RED);
		} else {
			overdueCell.add(new Paragraph("NO")).setBackgroundColor(GREEN);
		}

		table.addCell(overdueCell);
	}


}