package  com.example.RentNow.service;

import  com.example.RentNow.dto.User.*;
import  com.example.RentNow.mapper.UserMapper;
import  com.example.RentNow.model.User;
import  com.example.RentNow.repository.UserRepository;
import  com.example.RentNow.util.ByteArrayMultipartFile;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static  com.example.RentNow.specification.GenericSpecification.fieldNameLike;
import static  com.example.RentNow.specification.GenericSpecification.isActive;
import static  com.example.RentNow.specification.UserSpecification.hasRole;
import static  com.example.RentNow.specification.UserSpecification.hasUsernameEquals;
import static  com.example.RentNow.util.UserConstants.*;
import static  com.example.RentNow.util.Utils.getEntityOrThrow;
import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    final UserRepository userRepository;
    final ImageStorageService imageStorageService;
    final NewsletterService newsletterService;

    @Value("${custom.admin_email}")
    String ADMIN_EMAIL;

    public Page<UserDTO> getUsers(UserFilterDTO dto, int pageNo, int pageSize) {
        try {
            boolean isRequestEmpty = isNull(dto.getUsername()) && isNull(dto.getEmail()) && isNull(dto.getRole())
                    && isNull(dto.getFirstName()) && isNull(dto.getLastName())
                    && isNull(dto.getSortField()) && isNull(dto.getDirection());

            if (isRequestEmpty) {
                return userRepository.findAll(PageRequest.of(pageNo, pageSize)).map(u -> UserMapper.toDTO(u, newsletterService.findByUserEmail(dto.getEmail())));
            }

            Specification<User> specification = getSpecification(dto);
            Pageable pageable;
            Sort.Direction sortDirection = Sort.Direction.fromString(dto.getDirection());

            if (dto.getSortField().equals(DEFAULTSORT)) {
                pageable = PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, FIRST_NAME, LAST_NAME));
            } else if (dto.getSortField().equals("is_active")) {
                pageable = PageRequest.of(pageNo, pageSize);

                var users = userRepository.findAll(specification, pageable).map(u -> UserMapper.toDTO(u, newsletterService.findByUserEmail(dto.getEmail()))).getContent();
                List<UserDTO> sortedUsers;
                if (!dto.getDirection().equals("ASC")) {
                    sortedUsers = users.stream()
                            .sorted(Comparator.comparing(UserDTO::getIs_active))
                            .toList();
                } else {
                    sortedUsers = users.stream()
                            .sorted(Comparator.comparing(UserDTO::getIs_active).reversed())
                            .toList();
                }
                return new PageImpl<>(sortedUsers, pageable, sortedUsers.size());
            } else {
                pageable = PageRequest.of(pageNo, pageSize, Sort.by(sortDirection, dto.getSortField()));
            }

            return userRepository.findAll(specification, pageable).map(u -> UserMapper.toDTO(u, newsletterService.findByUserEmail(dto.getEmail())));
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
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

        if (nonNull(dto.getIs_active())) {
            specification = specification.and(isActive(dto.getIs_active()));
        }

        if (nonNull(dto.getRole())) {
            String userRole = dto.getRole().toString();
            if (!userRole.equals("ALL")) {
                specification = specification.and(hasRole(userRole));
            }
        }
        return specification;
    }


    public User updateUser(UserDTO userDTO, User.Role role, MultipartFile imageFile) {
        User user = getEntityOrThrow(() -> userRepository.findByEmail(userDTO.getEmail()), "User not found");
        user
                .setFirstName(userDTO.getFirstName())
                .setLastName(userDTO.getLastName())
                .setIs_active(userDTO.getIs_active())
                .setUsername(userDTO.getUsername())
                .setUpdated_date(LocalDateTime.now())
                .setRole(role);

            if (imageFile != null) {
                String imageUrl = imageStorageService.uploadImage("userphotos", imageFile);
                user.setPhotoUrl(imageUrl);
            }
        return userRepository.save(user);
    }

    public UserDTO findByEmail(String email) {
        User user = getEntityOrThrow(() -> userRepository.findByEmail(email), "User with email " + email + " not found");
        return UserMapper.toDTO(user, newsletterService.findByUserEmail(user.getEmail()));
    }

    public UserAddReponseDTO addUser(UserAddDTO userAddDTO) {
        if (userAddDTO.getEmail() == null || userAddDTO.getEmail().isEmpty()) {
            return null;
        }
        Optional<User> userOptional = userRepository.findByEmail(userAddDTO.getEmail());
        if (userOptional.isPresent()) {
            return UserMapper.toUserAddReponseDTOFromUser(userOptional.get(), newsletterService.findByUserEmail(userAddDTO.getEmail()));
        } else {
            User userToBeSaved = UserMapper.toUserFromUserAddDTO(userAddDTO);
            userToBeSaved
                    .setId(String.valueOf(UUID.randomUUID()))
                    .setCreated_date(LocalDateTime.now())
                    .setUpdated_date(LocalDateTime.now())
                    .setRole(userAddDTO.getEmail().equals(ADMIN_EMAIL) ? User.Role.ADMIN : User.Role.USER)
                    .setIs_active(true)
                    .setMailNotificationsEnabled(true);
            addUserPhotoUrl(userAddDTO, userToBeSaved);

            userRepository.save(userToBeSaved);
            newsletterService.subscribeToNewsletter(userToBeSaved);

            return UserMapper.toUserAddReponseDTOFromUser(userToBeSaved, newsletterService.findByUserEmail(userAddDTO.getEmail()));
        }
    }

    private void addUserPhotoUrl(UserAddDTO userAddDTO, User userToBeSaved) {
        if (userAddDTO.getPhotoUrl() != null && !userAddDTO.getPhotoUrl().isEmpty()) {
            try (InputStream imageStream = new URL(userAddDTO.getPhotoUrl()).openStream()) {
                ByteArrayOutputStream buffer = new ByteArrayOutputStream();

                byte[] data = new byte[1024];
                int bytesRead;
                while ((bytesRead = imageStream.read(data, 0, data.length)) != -1) {
                    buffer.write(data, 0, bytesRead);
                }

                MultipartFile multipartFile = new ByteArrayMultipartFile(
                        buffer.toByteArray(),
                        "user-photo.jpg",
                        "image/jpeg"
                );

                String publicImageUrl = imageStorageService.uploadImage("userphotos", multipartFile);
                userToBeSaved.setPhotoUrl(publicImageUrl);
            } catch (Exception e) {
                throw new RuntimeException("Failed to process and upload the image file.", e);
            }
        }
    }

    public void updateUserPreferences(String email, UserPreferencesDTO dto) {
        User user = getEntityOrThrow(() -> userRepository.findByEmail(email), "User not found!");
        newsletterService.updateNewsLetterStatus(user, dto.isSubscribedToNewsletter());
        user.setMailNotificationsEnabled(dto.isMailNotificationsEnabled());
        user.setUpdated_date(LocalDateTime.now());
        userRepository.save(user);
    }

    public List<User> findAll(){
        return userRepository.findAll();
    }
}

