package com.example.TechNow.TechNow.service;

import com.example.TechNow.TechNow.model.BookHistory;
import com.example.TechNow.TechNow.repository.BookHistoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BookHistoryService {


    private final BookHistoryRepository bookHistoryRepository;

    public List<BookHistory> findAll() {
        return bookHistoryRepository.findAll()
                .stream().distinct().toList();
    }
}
