package com.example.RentNow.config.filters.impl;

import com.example.RentNow.config.filters.ParameterNameValidationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class UserRequestFilter {

	final Set<String> USER_PARAMS = new HashSet<>(Arrays.asList("email", "role", "firstName", "lastName",
			"pageNo", "pageSize", "sortField", "direction", "username", "is_active"));


	@Bean
	FilterRegistrationBean<ParameterNameValidationFilter> usersFilter() {
		FilterRegistrationBean<ParameterNameValidationFilter> registrationBean = new FilterRegistrationBean<>();
		registrationBean.setFilter(new ParameterNameValidationFilter(USER_PARAMS));
		registrationBean.addUrlPatterns("/users");
		return registrationBean;
	}

}
