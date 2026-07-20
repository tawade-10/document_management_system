package com.example.mom.service.AuthService;

import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;

public interface AuthService {
    UsersCreationResponseDto addUser(UsersCreationRequestDto usersCreationRequestDto);

    String generateResetToken(String email);

    String resetPassword(String token, String newPassword);
}
