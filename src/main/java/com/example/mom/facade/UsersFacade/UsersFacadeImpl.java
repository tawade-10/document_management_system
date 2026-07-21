package com.example.mom.facade.UsersFacade;

import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.service.Users.UsersService;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UsersFacadeImpl implements UsersFacade{

    private final UsersService usersService;

    public UsersFacadeImpl(UsersService usersService) {
        this.usersService = usersService;
    }

    @Override
    public List<UsersCreationResponseDto> getAllUsers() {
        return usersService.getAllUsers();
    }

    @Override
    public UsersCreationResponseDto getUserById(String userId) {
        return usersService.getUserById(userId);
    }

    @Override
    public UsersCreationResponseDto updateUserStatus(String userId) {
        return usersService.updateUserStatus(userId);
    }
}
