package com.example.TechNow.TechNow.service;

import com.example.TechNow.TechNow.model.Link;
import com.example.TechNow.TechNow.repository.LinkRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static com.example.TechNow.TechNow.util.Utils.getEntityOrThrow;

@Service
@RequiredArgsConstructor
@Slf4j
public class LinkService {

	final LinkRepository linkRepository;

	public Link save(Link link) {
		link.setCreated_date(LocalDateTime.now());
		link.setUpdated_date(LocalDateTime.now());
		return linkRepository.save(link);
	}

	public Link findById(UUID id) {
		return getEntityOrThrow(() -> linkRepository.findById(id), "Link not found");
	}

	public Link update(Link link) {
		Link existing = findById(link.getId());
		existing.setUpdated_date(LocalDateTime.now());
		BeanUtils.copyProperties(link, existing);
		return linkRepository.save(existing);
	}

	public List<Link> findAll() {
		return linkRepository.findAll();
	}

	public void deleteLink(UUID id) {
		linkRepository.deleteById(id);
	}
}
