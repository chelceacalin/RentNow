package com.example.TechNow.TechNow.repository;

import com.example.TechNow.TechNow.model.BookHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BookHistoryRepository extends JpaRepository<BookHistory, UUID> {
    @Query("SELECT mh FROM BookHistory mh " +
            "WHERE mh.book.id = :id order by mh.rentedUntil desc limit 1")
    BookHistory findBookHistoryByRentedUntilMostRecent(UUID id);

    void deleteBookHistoryByBookId(UUID uuid);

    Page<BookHistory> findAllByRentedBy_Id(String userId, Pageable pageable);
}
