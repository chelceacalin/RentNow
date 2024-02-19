package com.example.TechNow.TechNow.repository;

import com.example.TechNow.TechNow.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID>, JpaSpecificationExecutor<Category> {
	Optional<Category> findByNameIgnoreCase(String name);

	Optional<Category> findByName(String name);
}
