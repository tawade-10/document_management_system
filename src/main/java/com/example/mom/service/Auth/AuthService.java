package com.example.mom.service.Auth;

import com.example.mom.dto.Passwords.CreatePasswordRequestDto;
import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {
    UsersCreationResponseDto addUser(UsersCreationRequestDto usersCreationRequestDto);

    String generateResetToken(String email);

    String resetPassword(String token, String newPassword);

    String createPassword(CreatePasswordRequestDto requestDto);

    Object logoutCustomer(HttpServletRequest request);
}
