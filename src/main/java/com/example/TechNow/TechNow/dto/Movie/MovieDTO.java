package com.example.TechNow.TechNow.dto.Movie;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieDTO {

    private UUID id;

    private String owner_username;

    private String title;

    private String director;

    private String category;

    private String description;

    private Boolean isAvailable;

    private String rentedBy;

    private LocalDate rentedDate;

    private LocalDate rentedUntil;
}