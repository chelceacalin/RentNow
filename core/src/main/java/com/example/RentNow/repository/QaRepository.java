package  com.example.RentNow.repository;

import  com.example.RentNow.model.QA;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QaRepository extends JpaRepository<QA, UUID> {

	@NotNull
	@Query("select qa from QA qa order by qa.updated_date desc")
	List<QA> findAllQA();
}
