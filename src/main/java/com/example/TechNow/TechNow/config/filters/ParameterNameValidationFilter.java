package com.example.TechNow.TechNow.config.filters;

import jakarta.servlet.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Set;

@RequiredArgsConstructor
@Slf4j
public class ParameterNameValidationFilter implements Filter {

	final Set<String> allowedParameterNames;

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
		String[] parameterNames = servletRequest.getParameterMap().keySet().toArray(new String[0]);
		for (String paramName : parameterNames) {
			if (!allowedParameterNames.contains(paramName)) {
				log.info("Parameter {} is not accepted",paramName);
				return;
			}
		}
		filterChain.doFilter(servletRequest, servletResponse);
	}
}
