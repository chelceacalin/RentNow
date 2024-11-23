package  com.example.RentNow.service;

import com.example.RentNow.model.NewsLetterSubscription;
import com.example.RentNow.model.User;
import com.example.RentNow.repository.NewsletterSubscriberRepository;
import com.example.RentNow.util.JwtUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
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
	final JwtUtils jwtUtils = new JwtUtils();

	public void updateNewsLetterStatus(User user, boolean isSubscribed) {
		Optional<NewsLetterSubscription> newsLetterOptional = newsletterSubscriberRepository.findByUserEmail(user.getEmail());
		if (newsLetterOptional.isEmpty()) {
			subscribeToNewsletter(user);
			return;
		}
		NewsLetterSubscription newsLetterSubscription = newsLetterOptional.get();
		if (isSubscribed) {
			newsLetterSubscription.setSubscribed(true);
			newsletterSubscriberRepository.save(newsLetterSubscription);
		} else {
			unsubscribe(newsLetterSubscription.getToken());
		}
	}

	@Async
	public void subscribeToNewsletter(User user) {
		NewsLetterSubscription newsLetterSubscription = new NewsLetterSubscription();
		String token = jwtUtils.generateToken(user.getEmail());
		newsLetterSubscription
				.setUser(user)
				.setSubscribed(true)
				.setToken(token)
				.setTokenExpiryDate(LocalDateTime.now().plusHours(24))
				.setCreated_date(LocalDateTime.now())
				.setUpdated_date(LocalDateTime.now());
		newsletterSubscriberRepository.save(newsLetterSubscription);
	}

	public NewsLetterSubscription findByUserEmail(String email) {
		Optional<NewsLetterSubscription> byUserEmail = newsletterSubscriberRepository.findByUserEmail(email);
		return byUserEmail.orElse(null);

	}

	public void unsubscribe(String token) {
		Claims claims = getClaims(token);

		String email = claims.getSubject();
		Date expirationDate = claims.getExpiration();

		if (expirationDate.before(new Date())) {
			throw new IllegalArgumentException("Token has expired.");
		}

		Optional<NewsLetterSubscription> subscriptionOpt = newsletterSubscriberRepository.findByUserEmail(email);

		if (subscriptionOpt.isPresent()) {
			NewsLetterSubscription subscription = subscriptionOpt.get();
			if (!subscription.getToken().equals(token)) {
				throw new IllegalArgumentException("Invalid token.");
			}
			subscription.setSubscribed(false);
			newsletterSubscriberRepository.save(subscription);
		}
	}

	private Claims getClaims(String token) {
		Claims claims;
		try {
			claims = Jwts.parser()
					.setSigningKey(jwtUtils.getSigningKey())
					.parseClaimsJws(token)
					.getBody();
		} catch (ExpiredJwtException e) {
			throw new IllegalArgumentException("Token has expired.");
		}
		return claims;
	}

	public NewsLetterSubscription save(NewsLetterSubscription newsLetterSubscription) {
		return newsletterSubscriberRepository.save(newsLetterSubscription);
	}
}
