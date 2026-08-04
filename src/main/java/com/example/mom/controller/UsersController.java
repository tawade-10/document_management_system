package com.example.mom.controller;

import com.example.mom.dto.Users.UsersCreationRequestDto;
import com.example.mom.dto.Users.UsersCreationResponseDto;
import com.example.mom.facade.Users.UsersFacade;
import org.springframework.data.domain.Page;
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UsersCreationResponseDto>> getAllUsers(@RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="5") int size){
        Page<UsersCreationResponseDto> users=usersFacade.getAllUsers(page,size);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsersCreationResponseDto> getUserById(@PathVariable String userId){
        UsersCreationResponseDto userById = usersFacade.getUserById(userId);
        return ResponseEntity.ok(userById);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UsersCreationResponseDto> updateUserDetails(@RequestBody UsersCreationRequestDto usersCreationRequestDto){
        UsersCreationResponseDto updatedUserDetails = usersFacade.updateUserDetails(usersCreationRequestDto);
        return ResponseEntity.ok(updatedUserDetails);
    }

    @PutMapping("/updateStatus/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsersCreationResponseDto> updateUserStatus(@PathVariable String userId){
        UsersCreationResponseDto updatedUserStatus = usersFacade.updateUserStatus(userId);
        return ResponseEntity.ok(updatedUserStatus);
    }
}
