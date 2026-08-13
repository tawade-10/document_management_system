package com.example.mom.config;

import com.example.mom.entity.Users;
import com.example.mom.repository.UsersRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PasswordEncoderRunner implements CommandLineRunner {

    private final UsersRepo usersRepo;
    private final PasswordEncoder passwordEncoder;

    public PasswordEncoderRunner(
            UsersRepo usersRepo,
            PasswordEncoder passwordEncoder
    ) {
        this.usersRepo = usersRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        List<Users> users = usersRepo.findAll();
        for (Users user : users) {
            String password = user.getPassword();
            if (password == null || password.isBlank()) {
                continue;
            }
            if (!password.startsWith("$2a$")
                    && !password.startsWith("$2b$")
                    && !password.startsWith("$2y$")) {

                user.setPassword(passwordEncoder.encode(password));
                usersRepo.save(user);
            }
        }
    }
}