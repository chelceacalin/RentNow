package  com.example.RentNow.service;

import  com.example.RentNow.dto.Category.CategoryAddResponseDTO;
import  com.example.RentNow.dto.Category.CategoryDTO;
import  com.example.RentNow.dto.Category.CategoryFilterDTO;
import  com.example.RentNow.mapper.CategoryMapper;
import  com.example.RentNow.model.Category;
import  com.example.RentNow.repository.CategoryRepository;
import  com.example.RentNow.util.Utils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static  com.example.RentNow.specification.CategorySpecification.getCategoryLike;
import static  com.example.RentNow.util.CategoryConstants.NAME;
import static  com.example.RentNow.util.Utils.getEntityOrThrow;
import static java.util.Objects.nonNull;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryService {
	final CategoryRepository categoryRepository;

	public Page<CategoryDTO> getCategories(CategoryFilterDTO dto, int pageNo, int pageSize) {
		if (dto.getName() == null && dto.getDirection() == null) {
			return categoryRepository.findAll(PageRequest.of(pageNo, pageSize)).map(CategoryMapper::toDTO);
		}
		Specification<Category> specification = getSpecification(dto);
		Sort.Direction sortDirection = Sort.Direction.fromString(dto.getDirection());
		Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, NAME));
		return categoryRepository.findAll(specification, pageable).map(CategoryMapper::toDTO);
	}

	public <T> Specification<T> getSpecification(CategoryFilterDTO dto) {
		Specification<T> specification = Specification.where(null);

		if (nonNull(dto.getName())) {
			specification = specification.and(getCategoryLike(dto.getName(), NAME));
		}
		return specification;
	}

	public Category createCategory(final CategoryDTO categoryDTO) {
		Optional<String> errorOptional = validateCategoryCaseInsensitive(categoryDTO);

		if (errorOptional.isPresent()) {
			throw new RuntimeException(errorOptional.get());
		}

		Category categoryToBeSaved = Category.builder()
				.name(categoryDTO.getName())
				.isAvailable(true)
				.created_date(LocalDateTime.now())
				.updated_date(LocalDateTime.now())
				.build();

		return categoryRepository.save(categoryToBeSaved);
	}

	public CategoryAddResponseDTO updateCategory(CategoryDTO categoryDTO, UUID id) {
		Optional<String> errorOptional = validateCategoryCaseSensitive(categoryDTO);

		if (errorOptional.isPresent()) {
			throw new RuntimeException("Category not valid");
		}
		Optional<Category> existsCategory = categoryRepository.findById(id);

		if (existsCategory.isEmpty()) {
			throw new RuntimeException("Category to be edited does not exist");
		}

		Category toUpdateCategory = existsCategory.get();
		toUpdateCategory.setName(categoryDTO.getName());
		toUpdateCategory.setCreated_date(toUpdateCategory.getCreated_date());
		toUpdateCategory.setUpdated_date(LocalDateTime.now());

		Category updatedCategory = categoryRepository.save(toUpdateCategory);
		return new CategoryAddResponseDTO()
				.setId(updatedCategory.getId())
				.setName(updatedCategory.getName())
				.setAvailable(updatedCategory.isAvailable())
				.setUpdated_date(Utils.parseDate(updatedCategory.getUpdated_date()))
				.setCreated_date(Utils.parseDate(updatedCategory.getCreated_date()));
	}

	public Optional<String> validateCategoryCaseSensitive(CategoryDTO categoryDTO) {
		if (categoryDTO.getName().isEmpty()) {
			return Optional.of("You must add a name for the category, it cannot be empty");
		}
		Optional<Category> nameCategory = categoryRepository.findByNameIdDiff(categoryDTO.getName(), categoryDTO.getId());
		if (nameCategory.isPresent()) {
			return Optional.of("This category already exists");
		}
		return Optional.empty();
	}

	public Optional<String> validateCategoryCaseInsensitive(CategoryDTO categoryDTO) {
		if (categoryDTO.getName().isEmpty()) {
			return Optional.of("You must add a name for the category, it cannot be empty");
		}
		Optional<Category> nameCategory = categoryRepository.findByNameIgnoreCase(categoryDTO.getName());
		if (nameCategory.isPresent()) {
			return Optional.of("This category already exists");
		}
		return Optional.empty();
	}

	public void deleteCategory(UUID id) {
		Category categoryFound = getEntityOrThrow(() -> categoryRepository.findById(id), "Category was already deleted by another user");
		if (!categoryFound.getBookList().isEmpty()) {
			throw new RuntimeException("Cannot delete a category associated with a book");
		}
		categoryRepository.deleteById(id);
	}

	public CategoryDTO findCategoryByName(String name) {
		Category category = getEntityOrThrow(() -> categoryRepository.findByNameIgnoreCase(name), "Category not found");
			return CategoryMapper.toDTO(category);
	}
}
