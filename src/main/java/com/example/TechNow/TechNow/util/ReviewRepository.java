package com.example.TechNow.TechNow.util;

import com.example.TechNow.TechNow.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {

    @Query("select r from Review r where r.book.id = ?1 order by r.created_date desc")
    List<Review> findAllByBookId(UUID bookId);

}
