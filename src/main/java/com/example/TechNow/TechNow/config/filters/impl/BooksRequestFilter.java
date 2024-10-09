package com.example.TechNow.TechNow.config.filters.impl;

import com.example.TechNow.TechNow.config.filters.ParameterNameValidationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class BooksRequestFilter {

	final Set<String> BOOKS_PARAMS = new HashSet<>(Arrays.asList("title", "director", "category", "isAvailable",
			"rentedBy", "owner_username","owner_email", "rentedDate", "rentedUntil", "direction", "sortField", "pageNo", "pageSize", "created_date"));


	@Bean
	public FilterRegistrationBean<ParameterNameValidationFilter> booksFilter() {
		FilterRegistrationBean<ParameterNameValidationFilter> registrationBean = new FilterRegistrationBean<>();
		registrationBean.setFilter(new ParameterNameValidationFilter(BOOKS_PARAMS));
		registrationBean.addUrlPatterns("/books");
		return registrationBean;
	}
}
