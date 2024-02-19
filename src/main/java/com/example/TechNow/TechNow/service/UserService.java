package com.example.TechNow.TechNow.service;

import com.example.TechNow.TechNow.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
	final UserRepository userRepository;


}
