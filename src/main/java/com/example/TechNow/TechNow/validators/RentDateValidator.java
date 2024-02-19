package com.example.TechNow.TechNow.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;

public class RentDateValidator implements ConstraintValidator<RentDateConstraint, LocalDate> {
    @Override
    public void initialize(RentDateConstraint constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(LocalDate rentedDate, ConstraintValidatorContext constraintValidatorContext) {
        if (rentedDate == null) {
            return true;
        }

        return !rentedDate.atStartOfDay().isBefore(LocalDate.now().atStartOfDay());
    }
}
