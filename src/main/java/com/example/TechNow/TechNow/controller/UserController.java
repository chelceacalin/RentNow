package com.example.TechNow.TechNow.controller;

import com.example.TechNow.TechNow.dto.User.UserAddDTO;
import com.example.TechNow.TechNow.dto.User.UserDTO;
import com.example.TechNow.TechNow.dto.User.UserFilterDTO;
import com.example.TechNow.TechNow.dto.User.UserPreferencesDTO;
import com.example.TechNow.TechNow.model.User;
import com.example.TechNow.TechNow.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@Slf4j
public class UserController extends BaseController {

	final UserService userService;


	@GetMapping
	public Page<UserDTO> getUsers(@ModelAttribute UserFilterDTO dto,
								  @RequestParam(defaultValue = "0", required = false) int pageNo,
								  @RequestParam(defaultValue = "15", required = false) int pageSize) {
		try {
			log.info("Searching for users");
			return userService.getUsers(dto, pageNo, pageSize);
		} catch (Exception e) {
			throw new RuntimeException("Users error: " + e.getMessage());
		}
	}

	@PostMapping("/update/{role}")
	public ResponseEntity<Object> updateUser(@RequestPart("userDTO") UserDTO userDTO, @PathVariable("role") User.Role role, @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
		log.info("Updating user {}", userDTO);
		return buildOkResponse(userService.updateUser(userDTO, role, imageFile));
	}

	@GetMapping("/{email}")
	public UserDTO findByUsername(@PathVariable String email) {
		return userService.findByEmail(email);
	}


	@PostMapping("/addUser")
	public ResponseEntity<Object> addUser(@RequestBody UserAddDTO userAddDTO) {
		return buildCreatedResponse(userService.addUser(userAddDTO));
	}

	@PutMapping("/preferences/{email}")
	public ResponseEntity<Object> updateUserPreferences(@PathVariable String email, @RequestBody UserPreferencesDTO userDTO) {
		userService.updateUserPreferences(email, userDTO);
		return buildOkResponse();
	}
}
