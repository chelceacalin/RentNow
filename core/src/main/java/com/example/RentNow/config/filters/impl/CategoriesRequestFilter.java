package com.example.RentNow.config.filters.impl;

import com.example.RentNow.config.filters.ParameterNameValidationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class CategoriesRequestFilter {
	final Set<String> categoryParams = new HashSet<>(Arrays.asList("name", "pageNo", "pageSize", "direction"));

	@Bean
	public FilterRegistrationBean<ParameterNameValidationFilter> categoriesFilter() {
		FilterRegistrationBean<ParameterNameValidationFilter> registrationBean = new FilterRegistrationBean<>();
		registrationBean.setFilter(new ParameterNameValidationFilter(categoryParams));
		registrationBean.addUrlPatterns("/categories");
		return registrationBean;
	}
}
