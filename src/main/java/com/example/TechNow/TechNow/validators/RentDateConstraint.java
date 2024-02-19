package com.example.TechNow.TechNow.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = RentDateValidator.class)
public @interface RentDateConstraint {
    String message() default "Rent date should start from today";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
