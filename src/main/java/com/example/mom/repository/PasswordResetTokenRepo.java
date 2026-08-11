package com.example.mom.repository;

import com.example.mom.entity.PasswordResetToken;
import com.example.mom.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepo extends JpaRepository<PasswordResetToken, Long> {

    PasswordResetToken findByToken(String token);

    void deleteByUsers(Users users);
}