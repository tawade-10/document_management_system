package com.example.mom.service.Users;

import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import org.springframework.data.domain.Page;

public interface UsersService {

    Page<UsersCreationResponseDto> getAllUsers(int page, int size);

    UsersCreationResponseDto getUserById(String userId);

    UsersCreationResponseDto updateUserDetails(UsersCreationRequestDto usersCreationRequestDto);

    UsersCreationResponseDto updateUserStatus(String userId);
}
