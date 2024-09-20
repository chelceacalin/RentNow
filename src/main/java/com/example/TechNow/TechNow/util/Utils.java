package com.example.TechNow.TechNow.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Utils {

	public static String parseDate(LocalDateTime date) {
		return date != null ? date.format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")) : null;
	}
}
