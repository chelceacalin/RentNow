package  com.example.RentNow.repository;

import  com.example.RentNow.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookRepository extends JpaRepository<Book, UUID>, JpaSpecificationExecutor<Book> {

	List<Book> findByOwner_Email(String ownerEmail);

	@Query("""
			select b from Book b
			join BookHistory bh
			on bh.book.id = b.id
			where b.owner.email=?1
			and extract(month from bh.rentedDate) =?2
			""")
	List<Book> findByOwnerEmailAndMonth(String ownerEmail, String month);
}
