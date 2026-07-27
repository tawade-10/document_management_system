package com.example.mom.controller;

import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.facade.UsersFacade.UsersFacade;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UsersFacade usersFacade;

    public UsersController(UsersFacade usersFacade) {
        this.usersFacade = usersFacade;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROOT_ADMIN','ADMIN')")
    public ResponseEntity<List<UsersCreationResponseDto>> getAllUsers(){
        List<UsersCreationResponseDto> allUsers = usersFacade.getAllUsers();
        return ResponseEntity.ok(allUsers);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UsersCreationResponseDto> getUserById(@PathVariable String userId){
        UsersCreationResponseDto userById = usersFacade.getUserById(userId);
        return ResponseEntity.ok(userById);
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<UsersCreationResponseDto> updateUserDetails(@PathVariable String userId, @RequestBody UsersCreationRequestDto usersCreationRequestDto){
        UsersCreationResponseDto updatedUserDetails = usersFacade.updateUserDetails(userId,usersCreationRequestDto);
        return ResponseEntity.ok(updatedUserDetails);
    }

    @PutMapping("/updateUserStatus/{userId}")
    public ResponseEntity<UsersCreationResponseDto> updateUserStatus(@PathVariable String userId){
        UsersCreationResponseDto updatedUserStatus = usersFacade.updateUserStatus(userId);
        return ResponseEntity.ok(updatedUserStatus);
    }
}
