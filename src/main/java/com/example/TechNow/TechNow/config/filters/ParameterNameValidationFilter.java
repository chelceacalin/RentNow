package com.example.TechNow.TechNow.config.filters;

import jakarta.servlet.*;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.util.Set;

@RequiredArgsConstructor
public class ParameterNameValidationFilter implements Filter {

	final Set<String> allowedParameterNames;

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
		String[] parameterNames = servletRequest.getParameterMap().keySet().toArray(new String[0]);
		for (String paramName : parameterNames) {
			if (!allowedParameterNames.contains(paramName)) {
				return;
			}
		}
		filterChain.doFilter(servletRequest, servletResponse);
	}
}
