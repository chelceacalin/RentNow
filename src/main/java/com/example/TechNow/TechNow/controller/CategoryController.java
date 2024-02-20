package com.example.TechNow.TechNow.controller;


import com.example.TechNow.TechNow.dto.Category.CategoryDTO;
import com.example.TechNow.TechNow.dto.Category.CategoryFilterDTO;
import com.example.TechNow.TechNow.service.CategoryService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
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
	public ResponseEntity<?> createCategory(@RequestBody final CategoryDTO categoryDTO) {
		Optional<String> errorOptional = categoryService.validateCategoryCaseInsensitive(categoryDTO);
		if (errorOptional.isEmpty()) {
			return new ResponseEntity<>(categoryService.createCategory(categoryDTO), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(errorOptional.get(), HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping("/update/{id}")
	public ResponseEntity<?> updateCategory(@RequestBody CategoryDTO categoryDTO,
											@PathVariable("id") @NotNull UUID id) {
		Optional<String> errorOptional = categoryService.validateCategoryCaseSensitive(categoryDTO);
		if (errorOptional.isEmpty()) {
			try {
				return new ResponseEntity<>(categoryService.updateCategory(categoryDTO, id), HttpStatus.OK);
			} catch (RuntimeException e) {
				return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
			}
		} else {
			return new ResponseEntity<>(errorOptional.get(), HttpStatus.BAD_REQUEST);
		}
	}


	@PostMapping("/delete/{id}")
	public ResponseEntity<?> deleteCategory(@PathVariable UUID id) {
		categoryService.deleteCategory(id);
		return ResponseEntity.ok("Category was deleted successfully");
	}
}
