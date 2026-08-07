package com.example.mom.service.Auth;

import com.example.mom.config.CustomIdGenerator;
import com.example.mom.config.JwtService;
import com.example.mom.config.PasswordGenerator;
import com.example.mom.dto.Passwords.CreatePasswordRequestDto;
import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.entity.*;
import com.example.mom.repository.*;
import com.example.mom.service.Email.EmailService;
import com.example.mom.service.Email.EmailServiceImpl;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.context.SecurityContextHolder;
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

    private final PasswordGenerator passwordGenerator;

    private final BlacklistedTokenRepo blacklistedTokenRepo;

    private final JwtService jwtService;

    private final EmailService emailService;

    public AuthServiceImpl(UsersRepo usersRepo, StatusRepo statusRepo, AuthorityProfilesRepo authorityProfilesRepo, CustomIdGenerator customIdGenerator, PasswordResetTokenRepo passwordResetTokenRepo, EmailServiceImpl emailServiceImpl, PasswordEncoder passwordEncoder, PasswordGenerator passwordGenerator, BlacklistedTokenRepo blacklistedTokenRepo, JwtService jwtService, EmailService emailService) {
        this.usersRepo = usersRepo;
        this.statusRepo = statusRepo;
        this.authorityProfilesRepo = authorityProfilesRepo;
        this.customIdGenerator = customIdGenerator;
        this.passwordResetTokenRepo = passwordResetTokenRepo;
        this.emailServiceImpl = emailServiceImpl;
        this.passwordEncoder = passwordEncoder;
        this.passwordGenerator = passwordGenerator;
        this.blacklistedTokenRepo = blacklistedTokenRepo;
        this.jwtService = jwtService;
        this.emailService = emailService;
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
                .orElseThrow(() -> new RuntimeException("Invalid Authority Profile!"));

        String tempPassword = passwordGenerator.generatePassword();

        Users user = new Users();
        user.setUserId(customIdGenerator.generateUserId(authority));
        user.setUserName(usersCreationRequestDto.getUserName());
        user.setEmail(usersCreationRequestDto.getEmail());
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setAuthorityProfiles(authority);
        user.setStatus(activeStatus);
        user.setCreatedAt(LocalDateTime.now());

        Users savedUser = usersRepo.save(user);
        passwordResetTokenRepo.deleteByUsers(savedUser);

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUsers(savedUser);
        resetToken.setExpiryTime(LocalDateTime.now().plusMinutes(15));

        passwordResetTokenRepo.save(resetToken);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        try {
            String subject = "Welcome to MOM Portal";
            String text = "Hello " + savedUser.getUserName() + ",\n\n" +
                            "Your MOM Portal account has been created successfully.\n\n" +
                            "Username : " + savedUser.getUserName() + "\n" +
                            "Temporary Password : " + tempPassword + "\n\n" +
                            "Please create your own password by visiting the link below.\n\n" +
                            "http://localhost:5173/create-password\n\n" +
                            "Regards,\n" +
                            "MOM Team";
            emailService.sendSimpleMessage(
                    savedUser.getEmail(),
                    subject,
                    text,
                    null
            );
        } catch (Exception e) {
            e.printStackTrace();
        }
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

    @Override
    @Transactional
    public String createPassword(CreatePasswordRequestDto requestDto) {

        Users user = usersRepo.findByEmail(requestDto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(requestDto.getTemporaryPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid temporary password");
        }

        user.setPassword(passwordEncoder.encode(requestDto.getNewPassword()));

        usersRepo.save(user);

        passwordResetTokenRepo.deleteByUsers(user);

        return "Password created successfully.";
    }

    @Override
    public String logoutCustomer(HttpServletRequest request) {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization token missing");
        }

        String token = authHeader.substring(7);

        if (blacklistedTokenRepo.existsByToken(token)) {
            return "Already logged out";
        }

        BlacklistedToken blacklistedToken = new BlacklistedToken();
        blacklistedToken.setToken(token);
        blacklistedToken.setExpiryTime(jwtService.extractExpiration(token)
                        .toInstant()
                        .atZone(java.time.ZoneId.systemDefault())
                        .toLocalDateTime());
        blacklistedTokenRepo.save(blacklistedToken);
        SecurityContextHolder.clearContext();
        return "Logged out successfully";
    }
}
