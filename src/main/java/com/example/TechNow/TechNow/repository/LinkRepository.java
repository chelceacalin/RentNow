package com.example.TechNow.TechNow.repository;

import com.example.TechNow.TechNow.model.Link;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LinkRepository extends JpaRepository<Link, UUID> {

	@Query("select l from Link l order by l.updated_date desc")
	List<Link> findAllLinks();
}
