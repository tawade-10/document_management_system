package com.example.mom.facade.AuthFacade;

import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import jakarta.validation.Valid;

public interface AuthFacade {

    UsersCreationResponseDto addUser(@Valid UsersCreationRequestDto usersCreationRequestDto);

    Object loginCustomer(UsersCreationRequestDto usersCreationRequestDto);

    String generateResetToken(String email);

    String resetPassword(String token, String newPassword);
}
