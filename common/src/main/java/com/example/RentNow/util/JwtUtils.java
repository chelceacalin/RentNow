package com.example.RentNow.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.time.Instant;
import java.util.Date;

public class JwtUtils {

	public String SECRET_KEY = "htyxmhnBw46wPMFafDw2FE43ffj9G6sT";

	public Key getSigningKey() {
		return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
	}

	public String generateToken(String email) {
		Instant expirationTime = Instant.now().plusSeconds(24 * 60 * 60);
		String token = Jwts.builder()
				.setSubject(email)
				.setIssuedAt(new Date())
				.setExpiration(Date.from(expirationTime))
				.signWith(SignatureAlgorithm.HS256, getSigningKey())
				.compact();
		return token;
	}
}
