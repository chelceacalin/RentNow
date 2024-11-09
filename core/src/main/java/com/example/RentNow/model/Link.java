package  com.example.RentNow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Table
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Link {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	UUID id;
	String name;
	String description;
	String url;
	LocalDateTime created_date;
	LocalDateTime updated_date;
}
