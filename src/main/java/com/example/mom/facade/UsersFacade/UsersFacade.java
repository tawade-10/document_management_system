package com.example.mom.facade.UsersFacade;

import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;

import java.util.List;

public interface UsersFacade {

    List<UsersCreationResponseDto> getAllUsers();

    UsersCreationResponseDto getUserById(String userId);

    UsersCreationResponseDto updateUserDetails(String userId, UsersCreationRequestDto usersCreationRequestDto);

    UsersCreationResponseDto updateUserStatus(String userId);
}
