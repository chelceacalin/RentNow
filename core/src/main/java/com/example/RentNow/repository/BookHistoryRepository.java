package  com.example.RentNow.repository;

import  com.example.RentNow.model.BookHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookHistoryRepository extends JpaRepository<BookHistory, UUID> {
    @Query("SELECT bh FROM BookHistory bh " +
            "WHERE bh.book.id = :id order by bh.updated_date desc limit 1")
    BookHistory findBookHistoryByRentedUntilMostRecent(UUID id);

    void deleteBookHistoryByBookId(UUID uuid);

    Page<BookHistory> findAllByRentedBy_Id(String userId, Pageable pageable);

    List<BookHistory> findAllByRentedByEmail(String email);

    @Query("SELECT bh FROM BookHistory bh WHERE bh.rentedBy.email = :email and extract(month from bh.rentedDate) = :monthNumber")
    List<BookHistory> findAllByRentedByEmailAndRentedDateMonth(@Param("email") String email, @Param("monthNumber") int monthNumber);
}
