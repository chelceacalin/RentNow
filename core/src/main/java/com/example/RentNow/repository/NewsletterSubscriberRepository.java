package  com.example.RentNow.repository;

import  com.example.RentNow.model.NewsLetterSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NewsletterSubscriberRepository extends JpaRepository<NewsLetterSubscription, UUID> {

	Optional<NewsLetterSubscription> findByUserEmail(String email);
}
