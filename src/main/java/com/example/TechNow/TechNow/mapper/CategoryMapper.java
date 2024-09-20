package com.example.TechNow.TechNow.mapper;

import com.example.TechNow.TechNow.dto.Category.CategoryDTO;
import com.example.TechNow.TechNow.model.Category;

import static com.example.TechNow.TechNow.util.Utils.parseDate;

public class CategoryMapper {

	public static CategoryDTO toDTO(Category category) {
		return CategoryDTO.builder()
				.id(category.getId())
				.name(category.getName())
				.created_date(parseDate(category.getCreated_date()))
				.build();
	}
}
