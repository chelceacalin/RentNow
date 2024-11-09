package  com.example.RentNow.specification;

import org.springframework.data.jpa.domain.Specification;

public class CategorySpecification {

	public static <T> Specification<T> getCategoryLike(String field, String name) {
		return (root, query, criteriaBuilder) -> criteriaBuilder.like(criteriaBuilder.lower(root.get(name)), "%" + field.toLowerCase() + "%");
	}
}
