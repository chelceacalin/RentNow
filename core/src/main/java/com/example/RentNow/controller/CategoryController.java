package  com.example.RentNow.controller;


import  com.example.RentNow.dto.Category.CategoryDTO;
import  com.example.RentNow.dto.Category.CategoryFilterDTO;
import  com.example.RentNow.service.CategoryService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/category")
@Slf4j
public class CategoryController extends BaseController {

	final CategoryService categoryService;

	@GetMapping()
	public ResponseEntity<Object> getCategories(@ModelAttribute CategoryFilterDTO dto,
										   @RequestParam(defaultValue = "0", required = false) int pageNo,
										   @RequestParam(defaultValue = "15", required = false) int pageSize) {
		try {
			return buildOkResponse(categoryService.getCategories(dto, pageNo, pageSize));
		} catch (Exception e) {
			log.error("Get categories error: {}", e.getMessage());
			throw new RuntimeException(e.getMessage());
		}
	}

	@GetMapping("/{name}")
	public ResponseEntity<Object> findCategoryByName(@PathVariable String name) {
		try {
			return buildOkResponse(categoryService.findCategoryByName(name));
		} catch (Exception e) {
			log.error("Find category error: {}", e.getMessage());
			throw new RuntimeException(e.getMessage());
		}
	}

	@PostMapping("/create")
	public ResponseEntity<Object> createCategory(@RequestBody final CategoryDTO categoryDTO) {
		try {
			return buildCreatedResponse(categoryService.createCategory(categoryDTO));
		} catch (Exception e) {
			log.error("Create category error: {}", e.getMessage());
			throw new RuntimeException(e.getMessage());
		}
	}

	@PostMapping("/update/{id}")
	public ResponseEntity<Object> updateCategory(@RequestBody CategoryDTO categoryDTO, @PathVariable("id") @NotNull UUID id) {
		try {
			return buildOkResponse(categoryService.updateCategory(categoryDTO, id));
		} catch (Exception e) {
			log.error("Update category error: {}", e.getMessage());
			throw new RuntimeException(e.getMessage());
		}
	}

	@PostMapping("/delete/{id}")
	public ResponseEntity<Object> deleteCategory(@PathVariable UUID id) {
		try {
			categoryService.deleteCategory(id);
			return buildOkResponse();
		} catch (Exception e) {
			log.error("Delete category error: {}", e.getMessage());
			throw new RuntimeException(e.getMessage());
		}
	}
}
