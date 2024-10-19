package com.example.TechNow.TechNow.service;

import com.example.TechNow.TechNow.dto.Book.BookDTO;
import com.example.TechNow.TechNow.dto.User.UserDTO;
import com.example.TechNow.TechNow.util.Utils;
import com.itextpdf.kernel.colors.DeviceRgb;
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

@Service
@RequiredArgsConstructor
public class ReportService {


	final BookService bookService;
	final UserService userService;
	final DeviceRgb GREEN = new DeviceRgb(0, 255, 0);
	final DeviceRgb ORANGE = new DeviceRgb(255, 165, 0);

	public byte[] generateTable(String email) {
		UserDTO user = userService.findByEmail(email);
		List<BookDTO> books = bookService.findBooksForUserEmail(email);

		ByteArrayOutputStream out = new ByteArrayOutputStream();
		try {
			PdfWriter writer = new PdfWriter(out);
			PdfDocument pdfDocument = new PdfDocument(writer);
			Document document = new Document(pdfDocument);
			generatePdfHeader(document, user);
			addTablesByMonth(books, document);
			document.close();
			return out.toByteArray();
		} catch (Exception e) {
			throw new RuntimeException(e.getMessage());
		}
	}

	private void addTablesByMonth(List<BookDTO> books, Document document) {
		addAvailableBooks(books, document);

		Map<String, List<BookDTO>> booksGroupedByMonth = books.stream()
				.filter(book -> book.getRentedDate() != null)
				.collect(Collectors.groupingBy(BookDTO::getRentedDate));
		addUnavailableBooksGroupedByMonth(document, booksGroupedByMonth);
	}

	private void addUnavailableBooksGroupedByMonth(Document document, Map<String, List<BookDTO>> booksGroupedByMonth) {
		for (Map.Entry<String, List<BookDTO>> entry : booksGroupedByMonth.entrySet()) {
			String month = entry.getKey();
			List<BookDTO> booksForMonth = entry.getValue();
			document.add(new Paragraph("Books rented in " + month).setBold().setFontSize(12));
			document.add(new Paragraph(" "));
			Table table = generateTableHeaders();
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
		List<BookDTO> booksWithoutDate = books.stream()
				.filter(book -> book.getRentedDate() == null)
				.toList();
		if (!booksWithoutDate.isEmpty()) {
			document.add(new Paragraph("Books without Rented Date").setBold().setFontSize(12));
			document.add(new Paragraph(" "));

			Table table = generateTableHeaders();

			for (BookDTO book : booksWithoutDate) {
				addCommonFields(table, book);
				table.addCell(new Cell().add(new Paragraph("N/A")).setPadding(2));
				table.addCell(new Cell().add(new Paragraph(book.getRentedUntil() != null ? book.getRentedUntil() : "N/A")).setPadding(2));
				addOverdueCell(book, table);
				table.addCell(new Cell().add(new Paragraph(book.getOwner_email())).setPadding(2));
			}
			document.add(table);

			document.add(new Paragraph(" "));
		}
	}

	private void addCommonFields(Table table, BookDTO book) {
		table.addCell(new Cell().add(new Paragraph(book.getTitle())).setPadding(2));
		table.addCell(new Cell().add(new Paragraph(book.getDirector())).setPadding(2));
		table.addCell(new Cell().add(new Paragraph(book.getCategory())).setPadding(2));
		addAvailabilityCell(book, table);
		table.addCell(new Cell().add(new Paragraph(book.getDescription())).setPadding(2));
	}

	private static @NotNull Table generateTableHeaders() {
		float[] columnWidths = {100F, 80F, 80F, 80F, 100F, 80F, 80F, 80F, 100F};
		Table table = new Table(columnWidths);

		String[] tableHeaders = {"Title", "Director", "Category", "Available", "Description", "Rented Date", "Rented Until", "Overdue", "Rented From"};
		for (String header : tableHeaders) {
			Cell headerCell = new Cell().add(new Paragraph(header).setBold().setFontSize(8));
			headerCell.setPadding(2);
			headerCell.setBackgroundColor(new DeviceRgb(240, 240, 240));
			headerCell.setTextAlignment(TextAlignment.CENTER);
			table.addHeaderCell(headerCell);
		}
		return table;
	}

	private static void generatePdfHeader(Document document, UserDTO user) {
		document.add(new Paragraph(" " + Utils.parseDate(LocalDateTime.now())));
		document.add(new Paragraph("Hi, " + user.getUsername()).setBold().setFontSize(14));
		document.add(new Paragraph("Here is your book report: ").setFontSize(10));
		document.add(new Paragraph(" "));
	}

	private void addAvailabilityCell(BookDTO book, Table table) {
		String msg = book.getIsAvailable() ? "Available" : "Rented";
		Cell availableCell = new Cell().setPadding(2);
		if (msg.equals("Available")) {
			availableCell.add(new Paragraph("YES")).setBackgroundColor(GREEN);
		} else {
			availableCell.add(new Paragraph("NO")).setBackgroundColor(ORANGE);
		}
		table.addCell(availableCell);
	}

	private void addOverdueCell(BookDTO book, Table table) {
		LocalDate rentedUntil = LocalDate.now().minusDays(1);
		if (book.getRentedUntil() != null) {
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
			rentedUntil = LocalDate.parse(book.getRentedUntil(), formatter);
		}
		LocalDate now = LocalDate.now();
		Cell overdueCell = new Cell().setPadding(2);

		if (rentedUntil.isEqual(now)) {
			overdueCell.add(new Paragraph("YES")).setBackgroundColor(ORANGE);
		} else if (rentedUntil.isBefore(now)) {
			var RED = new DeviceRgb(255, 0, 0);
			overdueCell.add(new Paragraph("YES")).setBackgroundColor(RED);
		} else {
			overdueCell.add(new Paragraph("NO")).setBackgroundColor(GREEN);
		}

		table.addCell(overdueCell);
	}
}
