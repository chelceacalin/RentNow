package  com.example.RentNow.dto.QA;

import lombok.Data;


@Data
public class QaSimilarity {
	String query;
	int top_k = 5;
}
