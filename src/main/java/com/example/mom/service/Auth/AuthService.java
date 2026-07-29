package com.example.mom.service.Auth;

import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {
    UsersCreationResponseDto addUser(UsersCreationRequestDto usersCreationRequestDto);

    String generateResetToken(String email);

    String resetPassword(String token, String newPassword);

    Object logoutCustomer(HttpServletRequest request);
}
