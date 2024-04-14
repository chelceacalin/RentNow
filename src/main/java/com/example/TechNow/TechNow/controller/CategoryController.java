package com.example.TechNow.TechNow.controller;


import com.example.TechNow.TechNow.dto.Category.CategoryDTO;
import com.example.TechNow.TechNow.dto.Category.CategoryFilterDTO;
import com.example.TechNow.TechNow.model.Category;
import com.example.TechNow.TechNow.service.CategoryService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/category")
public class CategoryController {

	final CategoryService categoryService;

	@GetMapping()
	public Page<CategoryDTO> getCategories(@ModelAttribute CategoryFilterDTO dto,
										   @RequestParam(defaultValue = "0", required = false) int pageNo,
										   @RequestParam(defaultValue = "15", required = false) int pageSize) {
		return categoryService.getCategories(dto, pageNo, pageSize);
	}

	@GetMapping("/{name}")
	public CategoryDTO findCategoryByName(@PathVariable String name) {
		return categoryService.findCategoryByName(name);
	}

	@PostMapping("/create")
	public ResponseEntity<Category> createCategory(@RequestBody final CategoryDTO categoryDTO) {
		return new ResponseEntity<>(categoryService.createCategory(categoryDTO), HttpStatus.OK);
	}

	@PostMapping("/update/{id}")
	public ResponseEntity<Category> updateCategory(@RequestBody CategoryDTO categoryDTO,
											@PathVariable("id") @NotNull UUID id) {
		return new ResponseEntity<>(categoryService.updateCategory(categoryDTO, id), HttpStatus.OK);
	}


	@PostMapping("/delete/{id}")
	public ResponseEntity<String> deleteCategory(@PathVariable UUID id) {
		categoryService.deleteCategory(id);
		return ResponseEntity.ok("Category was deleted successfully");
	}
}
