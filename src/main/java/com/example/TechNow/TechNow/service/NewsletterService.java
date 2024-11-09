package com.example.TechNow.TechNow.service;

import com.example.TechNow.TechNow.model.NewsLetterSubscription;
import com.example.TechNow.TechNow.model.User;
import com.example.TechNow.TechNow.repository.NewsletterSubscriberRepository;
import com.example.TechNow.TechNow.util.TokenUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class NewsletterService {

	final NewsletterSubscriberRepository newsletterSubscriberRepository;
	final TokenUtils tokenUtils;

	public void subscribeToNewsletter(User user) {
		Optional<NewsLetterSubscription> newsLetterOptional = newsletterSubscriberRepository.findByUserEmail(user.getEmail());
		log.info("Updating newsletter preferences ");
		if (newsLetterOptional.isPresent()) {
			return;
		}

		NewsLetterSubscription newsLetterSubscription = new NewsLetterSubscription();
		newsLetterSubscription
				.setUser(user)
				.setSubscribed(true)
				.setToken(tokenUtils.generateToken(user.getEmail()))
				.setTokenExpiryDate(LocalDateTime.now().plusHours(24))
				.setCreated_date(LocalDateTime.now())
				.setUpdated_date(LocalDateTime.now());

		newsletterSubscriberRepository.save(newsLetterSubscription);
	}

	public void updateNewsLetterStatus(User user, boolean isSubscribed) {
		Optional<NewsLetterSubscription> newsLetterOptional = newsletterSubscriberRepository.findByUserEmail(user.getEmail());
		if (newsLetterOptional.isPresent()) {
			if (isSubscribed) {
				NewsLetterSubscription newsLetterSubscription = newsLetterOptional.get();
				newsLetterSubscription.setSubscribed(true);
				newsletterSubscriberRepository.save(newsLetterSubscription);
			} else {
				unsubscribe(tokenUtils.generateToken(user.getEmail()));
			}
		}
	}

	public NewsLetterSubscription findByUserEmail(String email) {
		Optional<NewsLetterSubscription> byUserEmail = newsletterSubscriberRepository.findByUserEmail(email);
		return byUserEmail.orElse(null);

	}

	public void unsubscribe(String token) {
		Claims claims;
		try {
			claims = Jwts.parser()
					.setSigningKey(tokenUtils.SECRET_KEY)
					.parseClaimsJws(token)
					.getBody();
		} catch (ExpiredJwtException e) {
			throw new IllegalArgumentException("Token has expired.");
		}

		String email = claims.getSubject();
		Date expirationDate = claims.getExpiration();

		if (expirationDate.before(new Date())) {
			throw new IllegalArgumentException("Token has expired.");
		}

		Optional<NewsLetterSubscription> subscriptionOpt = newsletterSubscriberRepository.findByUserEmail(email);

		if (subscriptionOpt.isPresent()) {
			NewsLetterSubscription subscription = subscriptionOpt.get();
			if (subscription.getToken().equals(token)) {
				subscription.setSubscribed(false);
				newsletterSubscriberRepository.save(subscription);
			} else {
				throw new RuntimeException("Invalid token");
			}
		}
	}

	public NewsLetterSubscription save(NewsLetterSubscription newsLetterSubscription) {
		return newsletterSubscriberRepository.save(newsLetterSubscription);
	}
}
