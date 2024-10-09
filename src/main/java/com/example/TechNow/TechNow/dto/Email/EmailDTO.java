package com.example.TechNow.TechNow.dto.Email;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class EmailDTO {
    String renterUsername;
    String renterEmail;
    String bookTitle;
    String ownerEmail;
    String ownerUsername;
}
