package com.example.mom.service.Auth;

import com.example.mom.config.CustomIdGenerator;
import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.entity.AuthorityProfiles;
import com.example.mom.entity.PasswordResetToken;
import com.example.mom.entity.Status;
import com.example.mom.entity.Users;
import com.example.mom.repository.AuthorityProfilesRepo;
import com.example.mom.repository.PasswordResetTokenRepo;
import com.example.mom.repository.StatusRepo;
import com.example.mom.repository.UsersRepo;
import com.example.mom.service.Email.EmailServiceImpl;
import jakarta.mail.MessagingException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService{

    private final UsersRepo usersRepo;

    private final StatusRepo statusRepo;

    private final AuthorityProfilesRepo authorityProfilesRepo;

    private final CustomIdGenerator customIdGenerator;

    private final PasswordResetTokenRepo passwordResetTokenRepo;

    private final EmailServiceImpl emailServiceImpl;

    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UsersRepo usersRepo, StatusRepo statusRepo, AuthorityProfilesRepo authorityProfilesRepo, CustomIdGenerator customIdGenerator, PasswordResetTokenRepo passwordResetTokenRepo, EmailServiceImpl emailServiceImpl, PasswordEncoder passwordEncoder) {
        this.usersRepo = usersRepo;
        this.statusRepo = statusRepo;
        this.authorityProfilesRepo = authorityProfilesRepo;
        this.customIdGenerator = customIdGenerator;
        this.passwordResetTokenRepo = passwordResetTokenRepo;
        this.emailServiceImpl = emailServiceImpl;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UsersCreationResponseDto addUser(UsersCreationRequestDto usersCreationRequestDto) {

        Optional<Users> existingCustomerByUsername = usersRepo.findByUserName(usersCreationRequestDto.getUserName());
        if (existingCustomerByUsername.isPresent()) {
            return new UsersCreationResponseDto(existingCustomerByUsername.get());
        }

        Optional<Users> existingCustomerByEmail = usersRepo.findByEmail(usersCreationRequestDto.getEmail());
        if (existingCustomerByEmail.isPresent()) {
            return new UsersCreationResponseDto(existingCustomerByEmail.get());
        }

        Status activeStatus = statusRepo.findById("UAC")
                .orElseThrow(() -> new RuntimeException("Invalid Status!"));

        AuthorityProfiles authority = authorityProfilesRepo.findById(usersCreationRequestDto.getAuthorityId())
                .orElseThrow(() -> new RuntimeException("Invalid authority profile"));

        Users user = new Users();
        user.setUserId(customIdGenerator.generateUserId(authority));
        user.setUserName(usersCreationRequestDto.getUserName());
        user.setEmail(usersCreationRequestDto.getEmail());
        user.setPassword(usersCreationRequestDto.getPassword());
        user.setAuthorityProfiles(authority);
        user.setStatus(activeStatus);
        user.setCreatedAt(LocalDateTime.now());

        Users savedUser = usersRepo.save(user);

        return new UsersCreationResponseDto(savedUser);
    }

    @Transactional
    @Override
    public String generateResetToken(String email) {

        Optional<Users> optionalCustomer = usersRepo.findByEmail(email);

        if (optionalCustomer.isEmpty()) {
            return "User not found";
        }

        Users user = optionalCustomer.get();

        passwordResetTokenRepo.deleteByUsers(user);

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUsers(user);
        resetToken.setExpiryTime(LocalDateTime.now().plusMinutes(15));

        passwordResetTokenRepo.save(resetToken);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        try {
            emailServiceImpl.sendSimpleMessage(
                    user.getEmail(),
                    "Reset Your Password",
                    "Click the link to reset password:\n" + resetLink,
                    null
            );
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }

        return "Reset link sent to your email.";
    }

    @Override
    public String resetPassword(String token, String newPassword) {

        PasswordResetToken resetToken = passwordResetTokenRepo.findByToken(token);
        if (resetToken == null) {
            return "Invalid or used token";
        }
        if (resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            return "Token expired";
        }

        Users user = resetToken.getUsers();
        user.setPassword(passwordEncoder.encode(newPassword));
        usersRepo.save(user);

        passwordResetTokenRepo.delete(resetToken);

        return "Password reset successful";
    }
}
