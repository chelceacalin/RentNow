package com.example.TechNow.TechNow.dto.Category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class CategoryFilterDTO {

    private String name;

    private String direction;

    public CategoryFilterDTO() {
        direction = "ASC";
    }
}
