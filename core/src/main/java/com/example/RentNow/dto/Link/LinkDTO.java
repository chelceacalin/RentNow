package  com.example.RentNow.dto.Link;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class LinkDTO {
	UUID id;
	String name;
	String description;
	String url;
	boolean showUrl;
	LocalDateTime created_date;
	LocalDateTime updated_date;
}
