package com.example.TechNow.TechNow.specification;

import org.springframework.data.jpa.domain.Specification;

import static com.example.TechNow.TechNow.util.GenericConstants.IS_AVAILABLE;

public class GenericSpecification {

	public static <T> Specification<T> fieldNameLike(String field, String fieldName) {
		return (root, query, criteriaBuilder) -> criteriaBuilder.like(criteriaBuilder.lower(root.get(fieldName)), "%" + field.toLowerCase() + "%");
	}

	public static <T> Specification<T> isAvailable(Boolean isAvailable) {
		return ((root, query, criteriaBuilder) -> {
			if (Boolean.TRUE.equals(isAvailable)) {
				return criteriaBuilder.isTrue(root.get(IS_AVAILABLE));
			} else {
				return criteriaBuilder.isFalse(root.get(IS_AVAILABLE));
			}
		});
	}
}
