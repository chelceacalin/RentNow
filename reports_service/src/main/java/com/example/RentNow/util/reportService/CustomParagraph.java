package com.example.RentNow.util.reportService;

import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.property.Property;
import com.itextpdf.layout.property.TextAlignment;

public class CustomParagraph extends Paragraph {
	public CustomParagraph(String text, Float width, TextAlignment textAlignment) {
		super(text);
		this.setWidth(width);
		this.setFontSize(8);
		this.setTextAlignment(textAlignment);
		this.setProperty(Property.SPLIT_CHARACTERS, new CustomSplitCharacters());
	}
}