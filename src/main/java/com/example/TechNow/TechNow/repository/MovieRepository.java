package com.example.TechNow.TechNow.repository;

import com.example.TechNow.TechNow.model.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MovieRepository extends JpaRepository<Movie, UUID> , JpaSpecificationExecutor<Movie> {

	@Query("select m from Movie m")
	Page<Movie> findAll(Pageable pageable, Specification<Movie> specification);
}
