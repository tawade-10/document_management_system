package com.example.mom.facade.Users;

import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface UsersFacade {

    Page<UsersCreationResponseDto> getAllUsers(int page, int size);

    UsersCreationResponseDto getUserById(String userId);

    UsersCreationResponseDto updateUserDetails(UsersCreationRequestDto usersCreationRequestDto);

    UsersCreationResponseDto updateUserStatus(String userId);
}
