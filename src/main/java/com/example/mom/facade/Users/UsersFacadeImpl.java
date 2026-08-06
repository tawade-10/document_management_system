package com.example.mom.facade.Users;

import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.service.Users.UsersService;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UsersFacadeImpl implements UsersFacade{

    private final UsersService usersService;

    public UsersFacadeImpl(UsersService usersService) {
        this.usersService = usersService;
    }

    @Override
    public Page<UsersCreationResponseDto> getAllUsers(int page,int size,String search,String authority,String status,String sortBy,String sortDir) {
        return usersService.getAllUsers(page, size, search, authority, status, sortBy, sortDir);
    }

    @Override
    public UsersCreationResponseDto getUserById(String userId) {
        return usersService.getUserById(userId);
    }

    @Override
    public UsersCreationResponseDto updateUserDetails(UsersCreationRequestDto usersCreationRequestDto) {
        return usersService.updateUserDetails(usersCreationRequestDto);
    }

    @Override
    public UsersCreationResponseDto updateUserStatus(String userId) {
        return usersService.updateUserStatus(userId);
    }
}
