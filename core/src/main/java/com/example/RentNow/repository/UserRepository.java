package  com.example.RentNow.repository;


import  com.example.RentNow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {
	Optional<User> findByEmail(String email);


	@Query("select u from User u where u.role='ADMIN'")
	List<User> findAllAdmins();
}
