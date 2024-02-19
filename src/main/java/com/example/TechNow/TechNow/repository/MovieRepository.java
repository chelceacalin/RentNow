package com.example.TechNow.TechNow.repository;

import com.example.TechNow.TechNow.model.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MovieRepository extends JpaRepository<Movie, UUID> , JpaSpecificationExecutor<Movie> {
}
