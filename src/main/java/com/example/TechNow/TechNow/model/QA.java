package com.example.TechNow.TechNow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "QA")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class QA {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	UUID id;
	String question;
	String answer;
	LocalDateTime created_date;
	LocalDateTime updated_date;
}
