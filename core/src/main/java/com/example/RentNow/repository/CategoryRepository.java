package  com.example.RentNow.repository;

import  com.example.RentNow.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID>, JpaSpecificationExecutor<Category> {
	Optional<Category> findByNameIgnoreCase(String name);

	@Query("select c from Category c where c.name=?1 and c.id!=?2")
	Optional<Category> findByNameIdDiff(String name, UUID id);
}
