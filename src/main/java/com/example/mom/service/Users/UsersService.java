package com.example.mom.service.Users;

import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;

import java.util.List;

public interface UsersService {

    List<UsersCreationResponseDto> getAllUsers();

    UsersCreationResponseDto getUserById(String userId);

    UsersCreationResponseDto updateUserDetails(UsersCreationRequestDto usersCreationRequestDto);

    UsersCreationResponseDto updateUserStatus(String userId);
}
