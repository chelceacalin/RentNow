package com.example.TechNow.TechNow.controller;

import com.example.TechNow.TechNow.dto.User.UserDTO;
import com.example.TechNow.TechNow.dto.User.UserFilterDTO;
import com.example.TechNow.TechNow.model.User;
import com.example.TechNow.TechNow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

	final UserService userService;


	@GetMapping
	public Page<UserDTO> getUsers(@ModelAttribute UserFilterDTO dto,
								  @RequestParam(defaultValue = "0", required = false) int pageNo,
								  @RequestParam(defaultValue = "15", required = false) int pageSize) {
		return userService.getUsers(dto, pageNo, pageSize);
	}

	@PostMapping("/update/{role}")
	public ResponseEntity<User> updateUserRole(@RequestBody UserDTO userDTO, @PathVariable("role") User.Role role) {
		return ResponseEntity.ok(userService.updateUserRole(userDTO, role));
	}

	@GetMapping("/{email}")
	public UserDTO findByUsername(@PathVariable String email) {
		return userService.findByEmail(email);
	}

}
