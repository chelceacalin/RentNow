package com.example.TechNow.TechNow.repository;

import com.example.TechNow.TechNow.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BookRepository extends JpaRepository<Book, UUID> , JpaSpecificationExecutor<Book> {

	@Query("select m from Book m")
	Page<Book> findAll(Pageable pageable, Specification<Book> specification);
}
