package com.example.mom.service.Users;

import com.example.mom.dto.Users.UsersCreationResponseDto;

import java.util.List;

public interface UsersService {

    List<UsersCreationResponseDto> getAllUsers();

    UsersCreationResponseDto getUserById(String userId);

    UsersCreationResponseDto updateUserStatus(String userId);
}
