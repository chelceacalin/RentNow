package  com.example.RentNow.util.reportService;

import com.itextpdf.kernel.events.Event;
import com.itextpdf.kernel.events.IEventHandler;
import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfPage;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.kernel.pdf.xobject.PdfFormXObject;
import com.itextpdf.layout.Canvas;
import com.itextpdf.layout.property.TextAlignment;

public class PageNumberEventHandler implements IEventHandler {
	protected final PdfFormXObject placeholder;
	protected final float side = 20;
	protected final float x = 559;
	protected final float y = 25;

	public PageNumberEventHandler(PdfDocument pdf) {
		placeholder = new PdfFormXObject(new Rectangle(0, 0, side, side));
	}

	@Override
	public void handleEvent(Event event) {
		PdfDocumentEvent docEvent = (PdfDocumentEvent) event;
		PdfDocument pdf = docEvent.getDocument();
		PdfPage page = docEvent.getPage();
		int pageNumber = pdf.getPageNumber(page);

		PdfCanvas pdfCanvas = new PdfCanvas(page.newContentStreamAfter(), page.getResources(), pdf);
		Rectangle pageSize = page.getPageSize();

		try (Canvas canvas = new Canvas(pdfCanvas, pageSize)) {
			canvas.setFontSize(10);
			canvas.showTextAligned("Page " + pageNumber, x, y, TextAlignment.RIGHT);
			pdfCanvas.release();
		} catch (Exception e) {
			throw new RuntimeException(e.getMessage());
		}
	}
}
