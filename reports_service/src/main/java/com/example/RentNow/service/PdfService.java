package com.example.RentNow.service;

import com.example.RentNow.configuration.AbstractRestTemplate;
import com.example.RentNow.dto.Book.BookDTO;
import com.example.RentNow.util.reportService.CustomParagraph;
import com.example.RentNow.util.reportService.PageNumberEventHandler;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.example.RentNow.util.Utils.parseDate;

@Service
@Slf4j
public class PdfService extends AbstractRestTemplate {

	public PdfService(RestTemplate restTemplate) {
		super(restTemplate);
	}

	final DeviceRgb GREEN = new DeviceRgb(0, 255, 0);
	final DeviceRgb ORANGE = new DeviceRgb(255, 165, 0);
	final DeviceRgb RED = new DeviceRgb(255, 0, 0);
	final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

	private static Table generateTableHeaders(Boolean isAvailable) {

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
		List<BookDTO> books;
		String url = coreUrl + "/books/users/" + email;
		if (isAdmin) {
			url += "/books";
			if (month != null) {
				url += "?month=" + month;
			}
		} else {
			url += "/book-history";
			if (month != null) {
				url += "?month=" + month;
			}
		}
		try {
			ResponseEntity<String> ans = restTemplate.getForEntity(url, String.class);
			String body = ans.getBody();
			if ("[]".equals(body)) {
				return null;
			}
			books = new ObjectMapper().readValue(body, new TypeReference<>() {
			});

		} catch (Exception e) {
			log.error("Could not parse books");
			log.error(e.getMessage());
			return null;
		}

		ByteArrayOutputStream out = new ByteArrayOutputStream();
		try {
			PdfWriter writer = new PdfWriter(out);
			PdfDocument pdfDocument = new PdfDocument(writer);
			pdfDocument.addEventHandler(PdfDocumentEvent.END_PAGE, new PageNumberEventHandler(pdfDocument));

			Document document = new Document(pdfDocument, PageSize.A4.rotate());
			document.setMargins(20, 20, 20, 20);
			generatePdfHeader(document, email);
			addTablesByMonth(books, document);
			document.close();
			return out.toByteArray();
		} catch (Exception e) {
			throw new RuntimeException("Error generating PDF: " + e.getMessage());
		}
	}


	private static void generatePdfHeader(Document document, String userEmail) {
		document.add(new Paragraph("Generation Time: " + parseDate(LocalDateTime.now())));
		document.add(new Paragraph("Hello, " + userEmail).setBold().setFontSize(12));
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
