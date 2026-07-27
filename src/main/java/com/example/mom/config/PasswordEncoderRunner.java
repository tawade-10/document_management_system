package com.example.mom.config;

import com.example.mom.repository.UsersRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordEncoderRunner implements CommandLineRunner {

    private final UsersRepo usersRepo;
    private final PasswordEncoder passwordEncoder;

    public PasswordEncoderRunner(UsersRepo usersRepo, PasswordEncoder passwordEncoder) {
        this.usersRepo = usersRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        usersRepo.findByEmail("root@gmail.com").ifPresent(rootAdmin -> {
            String password = rootAdmin.getPassword();
            if (!password.startsWith("$2")) {
                rootAdmin.setPassword(passwordEncoder.encode(password));
                usersRepo.save(rootAdmin);
            }
        });

        usersRepo.findByEmail("admin@gmail.com").ifPresent(systemAdmin -> {
            String password = systemAdmin.getPassword();
            if (!password.startsWith("$2")) {
                systemAdmin.setPassword(passwordEncoder.encode(password));
                usersRepo.save(systemAdmin);
            }
        });
    }
}