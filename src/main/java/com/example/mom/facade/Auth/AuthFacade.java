package com.example.mom.facade.Auth;

import com.example.mom.dto.Users.LoginRequestDto;
import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

public interface AuthFacade {

    UsersCreationResponseDto addUser(@Valid UsersCreationRequestDto usersCreationRequestDto);

    Object loginCustomer(LoginRequestDto loginRequestDto);

    String generateResetToken(String email);

    String resetPassword(String token, String newPassword);

    Object logoutCustomer(HttpServletRequest request);
}
