package  com.example.RentNow.dto.Category;

import lombok.Data;

import java.util.UUID;

@Data
public class CategoryAddResponseDTO {

	UUID id;
	String name;
	String created_date;
	String updated_date;
	boolean isAvailable;
}
