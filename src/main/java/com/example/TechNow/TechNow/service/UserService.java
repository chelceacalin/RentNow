package com.example.TechNow.TechNow.service;

import com.example.TechNow.TechNow.dto.User.UserAddDTO;
import com.example.TechNow.TechNow.dto.User.UserAddReponseDTO;
import com.example.TechNow.TechNow.dto.User.UserDTO;
import com.example.TechNow.TechNow.dto.User.UserFilterDTO;
import com.example.TechNow.TechNow.mapper.UserMapper;
import com.example.TechNow.TechNow.model.User;
import com.example.TechNow.TechNow.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

import static com.example.TechNow.TechNow.specification.GenericSpecification.fieldNameLike;
import static com.example.TechNow.TechNow.specification.UserSpecification.hasRole;
import static com.example.TechNow.TechNow.specification.UserSpecification.hasUsernameEquals;
import static com.example.TechNow.TechNow.util.UserConstants.*;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
	final UserRepository userRepository;

	public Page<UserDTO> getUsers(UserFilterDTO dto, int pageNo, int pageSize) {
		boolean isRequestEmpty = isNull(dto.getUsername()) && isNull(dto.getEmail()) && isNull(dto.getRole()) && isNull(dto.getFirstName()) && isNull(dto.getLastName()) && isNull(dto.getSortField()) && isNull(dto.getDirection());
		if (isRequestEmpty) {
			return userRepository.findAll(PageRequest.of(pageNo, pageSize)).map(UserMapper::toDTO);
		}

		Specification<User> specification = getSpecification(dto);
		Pageable pageable;
		Sort.Direction sortDirection = Sort.Direction.fromString(dto.getDirection());
		if (dto.getSortField().equals(DEFAULTSORT)) {
			pageable = PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, FIRST_NAME, LAST_NAME));
		} else {
			pageable = PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, dto.getSortField()));
		}

		return userRepository.findAll(specification, pageable).map(UserMapper::toDTO);
	}

	public <T> Specification<T> getSpecification(UserFilterDTO dto) {
		Specification<T> specification = Specification.where(null);

		if (nonNull(dto.getUsername())) {
			specification = specification.and(hasUsernameEquals(dto.getUsername()));
		}

		if (nonNull(dto.getFirstName())) {
			specification = specification.and(fieldNameLike(dto.getFirstName(), FIRST_NAME));
		}

		if (nonNull(dto.getLastName())) {
			specification = specification.and(fieldNameLike(dto.getLastName(), LAST_NAME));
		}

		if (nonNull(dto.getEmail())) {
			specification = specification.and(fieldNameLike(dto.getEmail(), EMAIL));
		}

		if (nonNull(dto.getRole())) {
			specification = specification.and(hasRole(dto.getRole().toString()));
		}
		return specification;
	}


	public User updateUserRole(UserDTO userDTO, User.Role role) {
		Optional<User> userOptional = userRepository.findByEmail(userDTO.getEmail());
		User updatedUser = new User();
		if (userOptional.isPresent()) {
			User user = userOptional.get();
			user.setRole(role);
			updatedUser = userRepository.save(user);
		}
		return updatedUser;
	}

	public UserDTO findByEmail(String email) {
		Optional<User> userOptional = userRepository.findByEmail(email);
		if (userOptional.isPresent()) {
			User user = userOptional.get();
			return UserMapper.toDTO(user);
		} else {
			throw new RuntimeException("User with email " + email + " not found");
		}
	}

	public UserAddReponseDTO addUser(UserAddDTO userAddDTO) {
		if (userAddDTO.getEmail() == null || userAddDTO.getEmail().isEmpty()) {
			return null;
		}
		Optional<User> userOptional = userRepository.findByEmail(userAddDTO.getEmail());
		if (userOptional.isPresent()) {
			return UserMapper.toUserAddReponseDTOFromUser(userOptional.get());
		} else {
			User userToBeSaved = UserMapper.toUserFromUserAddDTO(userAddDTO);
			userToBeSaved.setId(String.valueOf(UUID.randomUUID()));
			userRepository.save(userToBeSaved);
			return UserMapper.toUserAddReponseDTOFromUser(userToBeSaved);
		}
	}
}

