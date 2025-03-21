package com.example.RentNow.service;

import com.example.RentNow.dto.Link.LinkDTO;
import com.example.RentNow.model.Link;
import com.example.RentNow.repository.LinkRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.example.RentNow.util.Utils.getEntityOrThrow;

@Service
@RequiredArgsConstructor
@Slf4j
public class LinkService {

    final LinkRepository linkRepository;

    @PostConstruct
    void init() {
        loadLinks();
    }

    public void loadLinks() {
        log.info("LinkService init...");
        Resource resource = new ClassPathResource("links.json");

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        try (InputStream inputStream = resource.getInputStream()) {
            List<Link> jsonData = objectMapper.readValue(inputStream, new TypeReference<>() {
            });

            jsonData.forEach(link -> {
                if (!linkRepository.existsByName(link.getName())) {
                    linkRepository.deleteLinkByName(link.getName());
                    linkRepository.save(link);
                }
            });
        } catch (Exception e) {
            log.error("Could not intialize default links {}", e.getMessage());
        }
    }


    public Link save(LinkDTO link) {
        Link newLink = new Link();
        BeanUtils.copyProperties(link, newLink);
        newLink.setCreated_date(LocalDateTime.now());
        newLink.setUpdated_date(LocalDateTime.now());
        return linkRepository.save(newLink);
    }

    public Link findById(UUID id) {
        return getEntityOrThrow(() -> linkRepository.findById(id), "Link not found");
    }

    public Link update(LinkDTO link) {
        Link existing = findById(link.getId());
        BeanUtils.copyProperties(link, existing);
        existing.setUpdated_date(LocalDateTime.now());
        return linkRepository.save(existing);
    }

    public List<Link> findAll() {
        return linkRepository.findAllLinks();
    }

    public void deleteLink(UUID id) {
        linkRepository.deleteById(id);
    }
}
