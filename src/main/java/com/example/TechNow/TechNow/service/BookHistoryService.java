package com.example.TechNow.TechNow.service;

import com.example.TechNow.TechNow.model.BookHistory;
import com.example.TechNow.TechNow.repository.BookHistoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookHistoryService {

    final BookHistoryRepository bookHistoryRepository;

    public List<BookHistory> findAll() {
        return bookHistoryRepository.findAll()
                .stream().distinct().toList();
    }

    public Map<String, Long> countByUserEmailAndStatus(String email) {
        var bookHistories = bookHistoryRepository.findAllByRentedByEmail(email);
        return bookHistories.stream().collect(Collectors.groupingBy(bookHistory -> bookHistory.getStatus().getValue(), Collectors.counting()));
    }

    public BookHistory save(BookHistory bookHistory) {
        return bookHistoryRepository.save(bookHistory);
    }
}
