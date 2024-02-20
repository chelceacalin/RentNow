package com.example.TechNow.TechNow.config.filters;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class MoviesRequestFilter {

	final Set<String> MOVIE_PARAMS = new HashSet<>(Arrays.asList("title", "director", "category", "isAvailable",
			"rentedBy", "owner_username", "rentedDate", "rentedUntil", "direction", "sortField", "pageNo", "pageSize"));


	@Bean
	public FilterRegistrationBean<ParameterNameValidationFilter> moviesFilter() {
		FilterRegistrationBean<ParameterNameValidationFilter> registrationBean = new FilterRegistrationBean<>();
		registrationBean.setFilter(new ParameterNameValidationFilter(MOVIE_PARAMS));
		registrationBean.addUrlPatterns("/movies");
		return registrationBean;
	}
}
