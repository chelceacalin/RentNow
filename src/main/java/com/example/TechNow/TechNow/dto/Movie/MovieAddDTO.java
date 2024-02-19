package com.example.TechNow.TechNow.dto.Movie;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieAddDTO {

    private UUID id;

    private String owner_username;

    private String title;

    private String director;

    private String category;

    private Boolean isAvailable;

    private String description;
}