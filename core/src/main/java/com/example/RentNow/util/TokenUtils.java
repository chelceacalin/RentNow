package  com.example.RentNow.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class TokenUtils {

	@Value("${custom.newsletter-secret}")
	public String SECRET_KEY;

	public String generateToken(String email) {
		return Jwts.builder()
				.setSubject(email)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000))
				.signWith(SignatureAlgorithm.HS256, SECRET_KEY)
				.compact();
	}
}
