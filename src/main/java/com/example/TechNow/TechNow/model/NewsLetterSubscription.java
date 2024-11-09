package com.example.TechNow.TechNow.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "newsletter_subscriptions")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class NewsLetterSubscription {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	UUID id;

	@OneToOne
	@JoinColumn(name = "user_id", nullable = false)
	User user;

	String token;

	LocalDateTime tokenExpiryDate;

	boolean subscribed = true;

	LocalDateTime created_date;

	LocalDateTime updated_date;
}
