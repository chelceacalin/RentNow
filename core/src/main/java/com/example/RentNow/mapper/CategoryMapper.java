package  com.example.RentNow.mapper;

import  com.example.RentNow.dto.Category.CategoryDTO;
import  com.example.RentNow.model.Category;

import static  com.example.RentNow.util.Utils.parseDate;

public class CategoryMapper {

	public static CategoryDTO toDTO(Category category) {
		return CategoryDTO.builder()
				.id(category.getId())
				.name(category.getName())
				.created_date(parseDate(category.getCreated_date()))
				.updated_date(parseDate(category.getUpdated_date()))
				.build();
	}
}
