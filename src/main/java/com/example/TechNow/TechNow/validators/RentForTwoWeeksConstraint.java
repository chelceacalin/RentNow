package com.example.TechNow.TechNow.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = RentForTwoWeeksValidator.class)
public @interface RentForTwoWeeksConstraint {
    String message() default "A book can be rented for maximum two weeks";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}

