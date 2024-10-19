package com.example.TechNow.TechNow.util.reportService;

import com.itextpdf.io.font.otf.Glyph;
import com.itextpdf.io.font.otf.GlyphLine;
import com.itextpdf.layout.splitting.DefaultSplitCharacters;

public class CustomSplitCharacters extends DefaultSplitCharacters {
	@Override
	public boolean isSplitCharacter(GlyphLine text, int glyphPos) {
		if (!text.get(glyphPos).hasValidUnicode()) {
			return false;
		}
		boolean baseResult = super.isSplitCharacter(text, glyphPos);
		boolean myResult = false;
		Glyph glyph = text.get(glyphPos);
		if (glyph.getUnicode() == '_') {
			myResult = true;
		}
		return myResult || baseResult;
	}
}