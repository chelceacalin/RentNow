package com.example.RentNow.service;

import com.example.RentNow.dto.Settings.SettingsAddDto;
import com.example.RentNow.model.Settings;
import com.example.RentNow.model.User;
import com.example.RentNow.repository.SettingsRepository;
import com.example.RentNow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class SettingsService {

	final SettingsRepository settingsRepository;
	private final UserRepository userRepository;

	public Settings findByUserEmail(String email) {
		Optional<Settings> settings = settingsRepository.findByUserEmail(email);
		if (settings.isEmpty()) {
			log.warn("{} does not have settings associated", email);
			return null;
		}
		return settings.get();
	}

	public Settings saveByUserEmail(String email, SettingsAddDto settingsAddDto) {
		Optional<Settings> settings = settingsRepository.findByUserEmail(email);
		if (settings.isPresent()) {
			return settings.get();
		}
		Settings newSettings = new Settings();
		newSettings.setDarkModeEnabled(settingsAddDto.isDarkModeEnabled());
		newSettings.setUser(userRepository.findByEmail(email).get());
		newSettings.setCreated_date(LocalDateTime.now());
		newSettings.setUpdated_date(LocalDateTime.now());
		return settingsRepository.save(newSettings);
	}

	public void saveByUser(User user, SettingsAddDto settingsAddDto) {
		Optional<Settings> settings = settingsRepository.findByUserEmail(user.getEmail());
		if (settings.isPresent()) {
			return;
		}
		Settings newSettings = new Settings();
		newSettings.setDarkModeEnabled(settingsAddDto.isDarkModeEnabled());
		newSettings.setUser(user);
		newSettings.setCreated_date(LocalDateTime.now());
		newSettings.setUpdated_date(LocalDateTime.now());
		settingsRepository.save(newSettings);
	}

	public Settings updateByUserEmail(String email, SettingsAddDto settingsAddDto) {
		Optional<Settings> settings = settingsRepository.findByUserEmail(email);
		if (settings.isPresent()) {
			Settings setting = settings.get();
			setting.setDarkModeEnabled(settingsAddDto.isDarkModeEnabled());
			settingsRepository.save(setting);
			return setting;
		}
		Settings newSettings = new Settings();
		newSettings.setDarkModeEnabled(settingsAddDto.isDarkModeEnabled());
		newSettings.setCreated_date(LocalDateTime.now());
		newSettings.setUpdated_date(LocalDateTime.now());
		return settingsRepository.save(newSettings);
	}

	public Settings updateByUserUser(User user, SettingsAddDto settingsAddDto) {
		Optional<Settings> settingsOptional = settingsRepository.findByUserEmail(user.getEmail());
		if (settingsOptional.isPresent()) {
			Settings setting = settingsOptional.get();
			setting.setDarkModeEnabled(settingsAddDto.isDarkModeEnabled());
			setting.setUpdated_date(LocalDateTime.now());
			settingsRepository.save(setting);
			return setting;
		}
		Settings newSettings = new Settings();
		newSettings.setDarkModeEnabled(settingsAddDto.isDarkModeEnabled());
		newSettings.setUser(user);
		newSettings.setUpdated_date(LocalDateTime.now());
		return settingsRepository.save(newSettings);
	}

}
