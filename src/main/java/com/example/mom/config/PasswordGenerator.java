package com.example.mom.config;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class PasswordGenerator {

    private static final String CHARACTERS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

    public String generatePassword() {

        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            password.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }

        return password.toString();
    }
}
